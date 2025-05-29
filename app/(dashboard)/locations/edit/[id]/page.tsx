"use client";

import { LocationForm } from "@/features/locations/presentation/components/location-form";
import { useLocationStore } from "@/features/locations/context/location-store";
import { useRouter } from "next/navigation";
import { LocationFormValues } from "@/features/locations/data/schemas/location.schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ILocation } from "@/features/locations/data/interfaces/location.interface";
import { use } from "react";

interface EditLocationPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditLocationPage({ params }: EditLocationPageProps) {
    const router = useRouter();
    const { updateLocation, getLocationById, isLoading } = useLocationStore();
    const [location, setLocation] = useState<ILocation | undefined>(undefined);
    const resolvedParams = use(params);

    useEffect(() => {
        const loadLocation = async () => {
            try {
                const data = await getLocationById(Number(resolvedParams.id));
                if (data) {
                    setLocation(data);
                } else {
                    toast.error("No se encontró la ubicación");
                    router.push("/locations");
                }
            } catch (error) {
                console.error("Error loading location:", error);
                toast.error("Error al cargar la ubicación");
                router.push("/locations");
            }
        };

        loadLocation();
    }, [getLocationById, resolvedParams.id, router]);

    const handleSubmit = async (data: LocationFormValues) => {
        try {
            await updateLocation(Number(resolvedParams.id), data as any);
            toast.success("Ubicación actualizada exitosamente");
            router.push("/locations");
        } catch (error) {
            console.error("Error updating location:", error);
            toast.error("Error al actualizar la ubicación");
        }
    };

    if (!location) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <LocationForm
                initialData={location}
                onSubmit={handleSubmit}
                isLoading={isLoading.update}
            />
        </div>
    );
} 