'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/features/users/context/user-store';
import { IUser, UserFormValues } from '@/features/users/data/interfaces/user.interface';
import UserForm from '../components/user-form';
import { toast } from 'sonner';

export default function UserFormView() {
    const { id } = useParams();
    const router = useRouter();
    const isEdit = id !== undefined && id !== 'new';

    const {
        getUserById,
        addUser,
        updateUser,
        loading,
    } = useUserStore();

    const [initialData, setInitialData] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && typeof id === 'string') {
                const userData = await getUserById(id);
                if (userData) {
                    setInitialData(userData);
                }
            }
        };
        loadData();
    }, [isEdit, id, getUserById]);

    const handleSubmit = async (data: UserFormValues) => {
        try {
            const userData = {
                userName: data.userName,
                password: data.password,
                career: data.career || 'FISEI',
                userType: data.userType,
                status: data.status || 'ACTIVE',
                person: {
                    dni: data.person.dni,
                    firstName: data.person.firstName,
                    middleName: data.person.middleName || '',
                    lastName: data.person.lastName,
                    secondLastName: data.person.secondLastName || '',
                    email: data.person.email,
                    birthDate: data.person.birthDate || '',
                    phone: data.person.phone || ''
                }
            };

            if (isEdit && typeof id === 'string') {
                await updateUser(id, userData);
                toast.success('Usuario actualizado exitosamente');
            } else {
                await addUser(userData);
                toast.success('Usuario creado exitosamente');
            }

            router.push('/users');
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            toast.error('Error al guardar el usuario');
        }
    };

    return (
        <div className="space-y-6">
            <UserForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
}
