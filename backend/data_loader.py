import pandas as pd
import torch
from torch_geometric.data import HeteroData

def load_real_graph_data(drug_interaction_csv_path: str, drug_target_csv_path: str):
    """
    Parses real Stanford SNAP Decagon datasets into a PyTorch Geometric Heterogeneous Graph.
    
    Expected Formats:
    - drug_interaction_csv_path (ChCh-Miner): Columns [STITCH 1, STITCH 2]
    - drug_target_csv_path (ChG-Miner): Columns [STITCH, Gene]
    """
    print("Loading datasets...")
    
    # 1. Load CSVs
    # ChCh-Miner Dataset (Drug-Drug Interactions)
    ddi_df = pd.read_csv(drug_interaction_csv_path, sep='\t', header=None, names=['drug_1', 'drug_2'])
    
    # ChG-Miner Dataset (Drug-Target Gene Interactions)
    dti_df = pd.read_csv(drug_target_csv_path, sep='\t', header=None, names=['drug', 'gene'])

    print(f"Loaded {len(ddi_df)} drug-drug interactions and {len(dti_df)} drug-target interactions.")

    # 2. Map String IDs to Integer Indices for PyTorch
    unique_drugs = pd.concat([ddi_df['drug_1'], ddi_df['drug_2'], dti_df['drug']]).unique()
    unique_genes = dti_df['gene'].unique()

    drug_to_idx = {drug: idx for idx, drug in enumerate(unique_drugs)}
    gene_to_idx = {gene: idx for idx, gene in enumerate(unique_genes)}

    print(f"Total Unique Drugs (Nodes): {len(unique_drugs)}")
    print(f"Total Unique Target Proteins/Genes (Nodes): {len(unique_genes)}")

    # 3. Build the Heterogeneous Data Object
    data = HeteroData()

    # Assign Node Features
    # Since we don't have chemical ML features (like SMILES fingerprints) loaded yet,
    # we initialize nodes with dummy standard normal embeddings that the GNN will learn to optimize.
    feature_dim = 64
    data['drug'].x = torch.randn(len(unique_drugs), feature_dim)
    data['protein'].x = torch.randn(len(unique_genes), feature_dim)

    # 4. Create Edges
    # Drug -> Drug Interaction Edges
    drug_src = torch.tensor([drug_to_idx[d] for d in ddi_df['drug_1']], dtype=torch.long)
    drug_dst = torch.tensor([drug_to_idx[d] for d in ddi_df['drug_2']], dtype=torch.long)
    data['drug', 'interacts_with', 'drug'].edge_index = torch.stack([drug_src, drug_dst])

    # Drug -> Protein Target Edges
    dt_src = torch.tensor([drug_to_idx[d] for d in dti_df['drug']], dtype=torch.long)
    dt_dst = torch.tensor([gene_to_idx[g] for g in dti_df['gene']], dtype=torch.long)
    data['drug', 'targets', 'protein'].edge_index = torch.stack([dt_src, dt_dst])

    # Reverse Edges (Protein -> Drug)
    data['protein', 'targeted_by', 'drug'].edge_index = torch.stack([dt_dst, dt_src])

    print("\nSuccessfully built Real PyTorch Geometric Graph! Structure:")
    print(data)
    
    return data, drug_to_idx, gene_to_idx

# Example usage (if the files existed locally):
# if __name__ == '__main__':
#     graph, d_map, g_map = load_real_graph_data('ChCh-Miner_durgbank-chem-chem.tsv', 'ChG-Miner_miner-chem-gene.tsv')
