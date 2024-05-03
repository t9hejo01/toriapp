'use client'

import { User } from "@/lib/models/UserModel"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, ValidationRule } from "react-hook-form"
import toast from "react-hot-toast"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"


export default function UserEditForm({ userId }: { userId: string }) {
    const { data: user, error } = useSWR(`/api/admin/users/${userId}`)
    const router = useRouter()
    const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
        `/api/admin/users/${userId}`,
        async (url, { arg }) => {
            const res = await fetch(`${url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arg),
            })
            const data = await res.json()
            if (!res.ok) return toast.error(data.message)
            
            toast.success('User updated successfully')
            router.push('/admin/users')
        }
    )
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<User>()

    useEffect(() => {
        if (!user) return
        setValue('name', user.name)
        setValue('email', user.email)
        setValue('isAdmin', user.isAdmin)
    }, [user, setValue])

    const formSubmit = async (formData: any) => {
        await updateUser(formData)
    }

    if (error) return error.message
    if (!user) return 'Loading...'

    const FormInput = ({
        id,
        name,
        required,
        pattern,
    }: {
        id: keyof User
        name: string
        required?: boolean
        pattern?: ValidationRule<RegExp>
    }) => {
        <div className="md:flex my-3">
            <label className="label md:w-1/5" htmlFor={id}>
                {name}
            </label>
            <div className="md:w-4/5">
                <input
                    type="text"
                    id={id}
                    {...register(id, {
                        required: required && `${name} is required`,
                        pattern,
                    })}
                    className="input input-bordered w-full max-w-md"
                />
                {errors[id]?.message && (
                    <div className="text-error">{errors[id]?.message}</div>
                )}
            </div>
        </div>
    }
}

