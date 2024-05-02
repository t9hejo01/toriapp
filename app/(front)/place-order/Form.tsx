'use client'

import CheckoutSteps from "@/components/CheckoutSteps"
import useCartService from "@/lib/hooks/useCartStore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import useSWRMutation from "swr/mutation"

const Form = () => {
    const router = useRouter()
    const {
        paymentMethod,
        shippingAddress,
        items,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        clear,
    } = useCartService()

    const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
        `/api/orders/mine`,
        async (url) => {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethod,
                    shippingAddress,
                    items,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                clear()
                toast.success('Order placed successfully')
                return router.push(`/order/${data.order._id}`)
            } else {
                toast.error(data.message)
            }
        } 
    )

    useEffect(() => {
        if (!paymentMethod) {
            return router.push('/payment')
        }
        if (items.length === 0) {
            return router.push('/')
        }
    }, [items.length, paymentMethod, router])

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    return (
        <div>
            <CheckoutSteps current={4} />

            <div className="grid md:grid-cols-4 md:gap-5 my-4">
                <div className="overflow-x-auto md:col-span-3">
                    <div className="card bg-base-300">
                        <div className="card-body">
                            <h2 className="card-title">Shipping Address</h2>
                            <p>
                                {shippingAddress.address}, {shippingAddress.city},{' '}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            <div>
                                <Link className="btn" href="/shipping">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card bg-bg-base-300">
                            <div className="card-body">
                                <h2 className="card-title">Order Summary</h2>
                                <ul className="space-y-3">
                                    <li>
                                        <div className="flex justify-between">
                                            <div>Items</div>
                                            <div>${itemsPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex justify-between">
                                            <div>Tax</div>
                                            <div>${taxPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex justify-between">
                                            <div>Shipping</div>
                                            <div>${shippingPrice}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex justify-between">
                                            <div>Total</div>
                                            <div>${totalPrice}</div>
                                        </div>
                                    </li>

                                    <li>
                                        <button
                                            onClick={() => placeOrder()}
                                            disabled={isPlacing}
                                            className="btn btn-primary w-full"
                                        >
                                            {isPlacing && (
                                                <span className="loading loading-spinner"></span>
                                            )}
                                            Place Order
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Form
