import torch
import torch.nn as nn
from torch_geometric.data import HeteroData
from gnn_model import MedGuardGNN

def create_mock_graph():
    """Builds a mock Heterogeneous Graph to validate the GNN structure."""
    data = HeteroData()
    
    # Define Nodes (10 drugs, 5 proteins, 3 enzymes, 2 patients) with random 16-dim features
    data['drug'].x = torch.randn(10, 16)
    data['protein'].x = torch.randn(5, 16)
    data['enzyme'].x = torch.randn(3, 16)
    data['patient'].x = torch.randn(2, 16)
    
    # Define Edges (Random connectivity for testing)
    data['drug', 'chemical_similarity', 'drug'].edge_index = torch.randint(0, 10, (2, 15))
    data['drug', 'pharmacodynamic', 'drug'].edge_index = torch.randint(0, 10, (2, 8))
    data['drug', 'pharmacokinetic', 'drug'].edge_index = torch.randint(0, 10, (2, 8))
    
    # Drug -> Protein Targets
    drug_to_prot = torch.empty((2, 12), dtype=torch.long)
    drug_to_prot[0] = torch.randint(0, 10, (12,)) # source indices (drugs)
    drug_to_prot[1] = torch.randint(0, 5, (12,))  # target indices (proteins)
    data['drug', 'targets', 'protein'].edge_index = drug_to_prot
    # Reverse edge
    data['protein', 'targeted_by', 'drug'].edge_index = data['drug', 'targets', 'protein'].edge_index.flip([0])
    
    # Protein -> Protein (Pathways)
    data['protein', 'metabolic_pathway', 'protein'].edge_index = torch.randint(0, 5, (2, 6))
    
    # Drug -> Enzyme (Inhibition)
    drug_to_enz = torch.empty((2, 5), dtype=torch.long)
    drug_to_enz[0] = torch.randint(0, 10, (5,))
    drug_to_enz[1] = torch.randint(0, 3, (5,))
    data['drug', 'inhibits_induces', 'enzyme'].edge_index = drug_to_enz
    # Reverse edge
    data['enzyme', 'affected_by', 'drug'].edge_index = data['drug', 'inhibits_induces', 'enzyme'].edge_index.flip([0])
    
    # Patient -> Drug
    patient_to_drug = torch.empty((2, 4), dtype=torch.long)
    patient_to_drug[0] = torch.randint(0, 2, (4,))
    patient_to_drug[1] = torch.randint(0, 10, (4,))
    data['patient', 'takes', 'drug'].edge_index = patient_to_drug
    data['drug', 'taken_by', 'patient'].edge_index = patient_to_drug.flip([0])
    
    # Patient -> Enzyme
    patient_to_enz = torch.empty((2, 2), dtype=torch.long)
    patient_to_enz[0] = torch.randint(0, 2, (2,))
    patient_to_enz[1] = torch.randint(0, 3, (2,))
    data['patient', 'has_status', 'enzyme'].edge_index = patient_to_enz
    data['enzyme', 'status_of', 'patient'].edge_index = patient_to_enz.flip([0])

    # Add self loops
    data['drug', 'self', 'drug'].edge_index = torch.stack([torch.arange(10), torch.arange(10)], dim=0)
    data['protein', 'self', 'protein'].edge_index = torch.stack([torch.arange(5), torch.arange(5)], dim=0)
    data['enzyme', 'self', 'enzyme'].edge_index = torch.stack([torch.arange(3), torch.arange(3)], dim=0)
    data['patient', 'self', 'patient'].edge_index = torch.stack([torch.arange(2), torch.arange(2)], dim=0)
    
    # Define Ground Truth Labels for the 2 Patients (Multi-Task)
    data['patient'].y_tox = torch.randint(0, 2, (2, 1)).float()  # Binary toxicity
    data['patient'].y_sev = torch.rand((2, 1)) * 5               # Severity 0-5
    data['patient'].y_org = torch.randint(0, 2, (2, 3)).float()  # [Liver, Kidney, Cardiac] risks
    data['patient'].y_conf = torch.rand((2, 1))                  # Confidence score
    
    # MULTI-DRUG (Polypharmacy) Mock Data (>2 drugs)
    # E.g. Querying the risk of taking 3 drugs, 4 drugs, and 5 drugs together
    data.polypharmacy_combos = [
        torch.tensor([0, 1, 5], dtype=torch.long),             # 3 drugs
        torch.tensor([2, 4, 6, 8], dtype=torch.long),          # 4 drugs
        torch.tensor([1, 2, 3, 4, 9], dtype=torch.long)        # 5 drugs
    ]
    data.y_polypharmacy_risk = torch.rand((3, 1)) # Ground truth risk for these combinations
    
    return data

def train():
    print("Building Mock Heterogeneous Graph...")
    data = create_mock_graph()
    print(data)
    
    # Initialize GNN Model (input dims handled automatically by SAGEConv(-1, ...))
    model = MedGuardGNN(hidden_channels=32, out_channels=16, num_layers=2)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
    
    # Define multi-task loss functions
    bce_loss = nn.BCELoss()
    mse_loss = nn.MSELoss()
    
    model.train()
    
    print("\nStarting Training Loop (5 Epochs)...")
    for epoch in range(5):
        optimizer.zero_grad()
        
        # Forward Pass with explicit our polypharmacy combinations (arbitrary number of drugs)
        out = model(data.x_dict, data.edge_index_dict, polypharmacy_combos=data.polypharmacy_combos)
        
        # Compute Loss for patient-centric heads
        loss_tox = bce_loss(out['toxicity_prob'], data['patient'].y_tox)
        loss_sev = mse_loss(out['severity'], data['patient'].y_sev)
        loss_org = bce_loss(out['organ_risk'], data['patient'].y_org)
        loss_conf = mse_loss(out['confidence'], data['patient'].y_conf)
        
        # Compute Loss for explicit multi-drug (>2) combinations
        loss_poly = mse_loss(out['polypharmacy_risk'], data.y_polypharmacy_risk)
        
        # Aggregate Loss
        total_loss = loss_tox + loss_sev + loss_org + loss_conf + loss_poly
        
        # Backward Pass & Optimize
        total_loss.backward()
        optimizer.step()
        
        print(f"Epoch {epoch+1}/5 | Total Loss: {total_loss.item():.4f}")
        print(f"    Patient - Tox: {loss_tox.item():.2f}, Sev: {loss_sev.item():.2f}, Org: {loss_org.item():.2f}, Conf: {loss_conf.item():.2f}")
        print(f"    Multi-Drug (>2) Polypharmacy Risk: {loss_poly.item():.2f}")
        
    print("\nTraining Loop Completed Successfully!")
    print("The MedGuard Heterogeneous GNN Architecture supports dynamic multi-drug interactions (>2 drugs)!")

if __name__ == '__main__':
    train()
