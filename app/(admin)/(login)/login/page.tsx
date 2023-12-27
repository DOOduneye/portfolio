"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ArrowLeft, Command, Loader } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { useSetAtom } from "jotai";
import { auth } from "@/lib/firebase";
import { userAtom } from "@/atoms/user-atom";
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AdminNavbar } from "../../admin/_components/admin-navbar";

const Login = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        email: z.string().email('Please enter a valid email address.').min(5),
        password: z.string().min(8, 'Password must be at least 8 characters long.')
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onBlur'
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            toast.success('Logged in successfully!');
            router.replace('/admin');
        } catch (error) {
            toast.error('Failed to login!');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className='flex flex-col items-center justify-center min-h-screen space-y-5'>
            <div role="button" className='group cursor-pointer absolute top-5 left-5 flex flex-row gap-2 items-center' onClick={() => router.replace('/')}>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-300 ease-in-out" />
                <h1 className='text-md font-semibold'>Home</h1>
            </div>
            <div className='flex flex-row gap-2 items-center'>
                <Command className="w-6 h-6" />
                <h1 className='text-2xl font-semibold'>Login</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-72">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Login'}
                    </Button>
                </form>
            </Form>


        </main >
    )
}

export default Login;
