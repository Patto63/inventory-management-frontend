'use client';
import { useEffect, useState } from 'react'
import { useColorStore } from '../../context/color-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import ColorTable from '../components/color-table'

import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog'

import {
    Breadcrumb, BreadcrumbList, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaletteIcon, Plus } from 'lucide-react'

export default function ColorView() {
    const {
        colors,
        loading,
        getColors,
        deleteColor,
        currentPage,
        totalPages,
    } = useColorStore();

    const [openDialog, setOpenDialog] = useState(false);
    const [colorIdToDelete, setColorIdToDelete] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        loadColors();
    }, [currentPage]);

    const loadColors = async () => {
        try {
            await getColors(currentPage, 10);
        } catch (error) {
            toast.error('Error al cargar los colores');
        }
    };

    const handlePageChange = async (page: number) => {
        try {
            await getColors(page, 10);
        } catch (error) {
            toast.error('Error al cambiar de página');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteColor(id);
            toast.success('Color eliminado exitosamente');
            await loadColors();
        } catch (error) {
            toast.error('Error al eliminar el color');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Configuración</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <PaletteIcon className="h-4 w-4 text-primary" />
                                <BreadcrumbPage>Colores</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-2xl font-bold tracking-tight mt-2">Lista de Colores</h2>
                </div>
                <Button onClick={() => router.push('/colors/new')} className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Color
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <ColorTable
                        colors={colors}
                        onDelete={handleDelete}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el color.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (colorIdToDelete !== null) {
                                    handleDelete(colorIdToDelete);
                                    setOpenDialog(false);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
