import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import HeteroConv, SAGEConv, Linear

class MedGuardGNN(nn.Module):
    def __init__(self, hidden_channels, out_channels, num_layers=2):
        super().__init__()
        
        self.convs = torch.nn.ModuleList()
        # Create HeteroConv layers to pass messages between different node types over edges
        for _ in range(num_layers):
            conv = HeteroConv({
                # Drug-Drug Interactions
                ('drug', 'chemical_similarity', 'drug'): SAGEConv(-1, hidden_channels),
                ('drug', 'pharmacodynamic', 'drug'): SAGEConv(-1, hidden_channels),
                ('drug', 'pharmacokinetic', 'drug'): SAGEConv(-1, hidden_channels),
                
                # Drug-Target relationships
                ('drug', 'targets', 'protein'): SAGEConv(-1, hidden_channels),
                ('protein', 'targeted_by', 'drug'): SAGEConv(-1, hidden_channels), # Reverse edge
                
                # Metabolic Pathways
                ('protein', 'metabolic_pathway', 'protein'): SAGEConv(-1, hidden_channels),
                
                # Drug-Enzyme (e.g. CYP450 inhibitors)
                ('drug', 'inhibits_induces', 'enzyme'): SAGEConv(-1, hidden_channels),
                ('enzyme', 'affected_by', 'drug'): SAGEConv(-1, hidden_channels), # Reverse edge
                
                # Patient biological relationship
                ('patient', 'takes', 'drug'): SAGEConv(-1, hidden_channels),
                ('drug', 'taken_by', 'patient'): SAGEConv(-1, hidden_channels),
                ('patient', 'has_status', 'enzyme'): SAGEConv(-1, hidden_channels),
                ('enzyme', 'status_of', 'patient'): SAGEConv(-1, hidden_channels),
            }, aggr='sum')
            
            # Add self-loops to preserve node embeddings if disconnected
            for node_type in ['drug', 'protein', 'enzyme', 'patient']:
                conv.convs[node_type, 'self', node_type] = SAGEConv(-1, hidden_channels)
                
            self.convs.append(conv)
            
        # Multi-Task Prediction Heads (Taking 'patient' or 'drug' node embeddings as input)
        # Assuming we are predicting the interaction/toxicity specifically based on the patient taking a set of drugs
        # We will pool/use the patient node embeddings to make the final prediction
        
        # 1. Toxicity Probability (Classification: 0.0 to 1.0)
        self.tox_head = nn.Sequential(
            Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            Linear(hidden_channels // 2, 1),
            nn.Sigmoid()
        )
        
        # 2. Adverse Reaction Severity (Regression: e.g. 1-5 score, scaled to 0-1 or raw)
        self.severity_head = nn.Sequential(
            Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            Linear(hidden_channels // 2, 1)
        )
        
        # 3. Organ-Specific Risk (Multi-Label Classification: [Liver, Kidney, Cardiac])
        self.organ_risk_head = nn.Sequential(
            Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            Linear(hidden_channels // 2, 3), # 3 outputs
            nn.Sigmoid() 
        )
        
        # 4. Interaction Confidence Score (Regression: 0.0 to 1.0)
        self.confidence_head = nn.Sequential(
            Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            Linear(hidden_channels // 2, 1),
            nn.Sigmoid()
        )

        # 5. Multi-Drug (Polypharmacy) Interaction Head
        # Explicitly predicts the interaction risk of an arbitrary number of drugs (e.g., 3, 4, 5+ drugs)
        self.polypharmacy_head = nn.Sequential(
            Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            Linear(hidden_channels // 2, 1),
            nn.Sigmoid()
        )

    def forward(self, x_dict, edge_index_dict, polypharmacy_combos=None):
        # Pass features through heterogeneous graph convolutions
        for conv in self.convs:
            x_dict = conv(x_dict, edge_index_dict)
            x_dict = {key: F.relu(x) for key, x in x_dict.items()}
            
        # Extract the node embeddings we want to make predictions on.
        # In this framing, the "Patient" node aggregates all information about 
        # what drugs they take, their enzymes, and the cascading biological pathways.
        patient_emb = x_dict['patient']
        
        # Generate the patient-centric predictions
        tox_prob = self.tox_head(patient_emb)
        severity = self.severity_head(patient_emb)
        organ_risk = self.organ_risk_head(patient_emb)
        confidence = self.confidence_head(patient_emb)
        
        out = {
            'toxicity_prob': tox_prob,
            'severity': severity,
            'organ_risk': organ_risk,
            'confidence': confidence
        }

        # If explicit multi-drug combinations are queried (e.g., assessing the exact risk of 3+ specific drugs)
        if polypharmacy_combos is not None:
            poly_scores = []
            for combo in polypharmacy_combos:
                # combo is a list or 1D tensor of drug indices (e.g., [0, 4, 7], representing >2 drugs)
                drug_embs = x_dict['drug'][combo]
                
                # Dynamically pool the embeddings for this arbitrary sequence of drugs
                # Mean pooling combines their learned pharmacological profiles
                combo_emb = drug_embs.mean(dim=0, keepdim=True) 
                
                # Pass the pooled n-drug embedding through the multi-drug head
                score = self.polypharmacy_head(combo_emb)
                poly_scores.append(score)
            
            # Combine individual combo scores into a single batched tensor
            out['polypharmacy_risk'] = torch.cat(poly_scores, dim=0)

        return out
