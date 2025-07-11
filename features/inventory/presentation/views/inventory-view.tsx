"use client";

import { useEffect } from "react";
import { useInventoryStore } from "../../context/inventory-store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { InventoryHeader } from "../components/inventory-header";
import { InventoryTableView } from "../components/inventory-table-view";
import { InventoryGridView } from "../components/inventory-grid-view";
import { InventoryListView } from "../components/inventory-list-view";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useStateStore } from "@/features/states/context/state-store";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";

type ViewType = 'table' | 'grid' | 'list';

export const InventoryView = () => {
    const { getInventoryItems, loading, items, filters, setFilters, currentPage, totalPages, setPage, isEmpty, error } = useInventoryStore();
    const { getCategories } = useCategoryStore();
    const { getItemTypes } = useItemTypeStore();
    const { getStates } = useStateStore();
    const router = useRouter();

    useEffect(() => {
        getInventoryItems();
        getCategories();
        getItemTypes();
        getStates();
    }, [getInventoryItems, getCategories, getItemTypes, getStates]);

    const handleViewChange = (view: ViewType) => {
        setFilters({ ...filters, view });
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const currentView = (filters as any).view || 'table';

    // Empty state component
    const EmptyInventoryState = () => (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
            <Package className="h-16 w-16 mb-4 text-muted-foreground/50" />
            <p className="mb-4 text-lg font-medium">No hay items en el inventario</p>
            <p className="mb-6 text-sm text-muted-foreground text-center max-w-md">
                {error || "Comienza agregando el primer item al inventario para gestionar tus activos."}
            </p>
        </div>
    );

    return (
        <div>
            <div className="space-y-1 mb-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <Breadcrumb className="mb-6">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <span className="text-muted-foreground font-medium">Operaciones</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <Package className="inline mr-1 h-4 w-4 text-red-600 align-middle" />
                                    <BreadcrumbPage>Inventario</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="text-2xl font-bold tracking-tight">Lista de Inventario</h2>
                        <p className="text-muted-foreground">Todos los items registrados en el sistema</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col h-full">
                <InventoryHeader
                    onViewChange={handleViewChange}
                    currentView={currentView}
                />

                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : isEmpty ? (
                        <EmptyInventoryState />
                    ) : (
                        <>
                            {currentView === 'table' && (
                                <InventoryTableView
                                    items={items || []}
                                />
                            )}
                            {currentView === 'grid' && (
                                <InventoryGridView
                                    items={items || []}
                                />
                            )}
                            {currentView === 'list' && (
                                <InventoryListView
                                    items={items || []}
                                />
                            )}
                        </>
                    )}
                </div>

                {!isEmpty && totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}; 