"use client";

import { useEffect, useState } from "react";
import { InventoryCard } from "../components/inventory-card";
import { InventoryFilterBar } from "../components/inventory-filter-bar";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { InventoryListItem } from "../components/inventory-list-item";
import { InventoryTableView } from "../components/inventory-table-view";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, Table, Plus, Barcode } from "lucide-react";
import { useNavigateToAddProduct } from "@/features/inventory/hooks/use-navigate-to-add-product";
import { ScanProductModal } from "../components/scan-product-modal";
import { EditProductModal } from "../components/edit-product-modal";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { toast } from "sonner";

export const InventoryView = () => {
  const {
    filteredItems,
    items,
    isLoading,
    error,
    fetchItems,
    viewMode,
    setViewMode,
    updateItem,
  } = useInventoryStore();

  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<InventoryItem | null>(null);
  const { navigateToAddProduct } = useNavigateToAddProduct();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSaveProduct = async (updatedProduct: InventoryItem, originalProduct: InventoryItem) => {
    try {
      await updateItem(updatedProduct, originalProduct);
      toast.success("Producto actualizado correctamente");
      setEditModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el producto";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <div>Cargando inventario...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const itemsArray = Array.isArray(items) ? items : [];
  const filteredItemsArray = Array.isArray(filteredItems) ? filteredItems : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos en Inventario</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full py-2 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
          <InventoryFilterBar
            onFilterChange={(newFilters) => {
              useInventoryStore.getState().setFilters(newFilters);
              useInventoryStore.getState().applyFilters();
            }}
            onClear={() => useInventoryStore.getState().clearFilters()}
          />
          <div className="flex items-center gap-2">
            <div className="border rounded-md flex">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <Grid2X2 size={18} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List size={18} />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Table size={18} />
              </Button>
            </div>
            <Button
              onClick={() => setScanModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Barcode size={18} />
              <span>Escanear</span>
            </Button>
            <Button
              onClick={navigateToAddProduct}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Registrar Producto</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <InventoryTableView
          items={itemsArray}
          onViewClick={(item) => console.log("Ver detalles", item)}
          onLoanClick={(item) => console.log("Solicitar", item)}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItemsArray.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onViewClick={() => console.log("Ver detalles", item)}
              onLoanClick={() => console.log("Solicitar", item)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItemsArray.map((item) => (
            <InventoryListItem
              key={item.id}
              product={item}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {viewMode === "table" && itemsArray.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No hay productos en el inventario.
          </p>
        </div>
      )}

      {(viewMode === "grid" || viewMode === "list") && filteredItemsArray.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No se encontraron productos que coincidan con los filtros.
          </p>
        </div>
      )}

      <ScanProductModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onEdit={(product) => {
          setScanModalOpen(false);
          setProductToEdit(product);
          setEditModalOpen(true);
        }}
      />

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={productToEdit}
        onSave={handleSaveProduct}
      />
    </div>
  );
}