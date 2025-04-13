'use client';

// System Components import
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios, { AxiosResponse } from "axios"


// UI Components import
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom';
import { domain } from './lib/consts';


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name is required"
    }),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password too short"
    })
});

const Register = () => {

    const router = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response: AxiosResponse = await axios.post(`${domain}/api/auth/register`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (response.status === 200) {
                toast.success(data.message || "Register successful!", {
                    style: {
                        "backgroundColor": "#D5F5E3",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 1500
                });
                form.reset();
                router('/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const data = error.response;
                if (data.status === 401) {
                    toast.error(data.data.message || "User Already exits kindly login", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    })
                    form.reset();
                } else if (data.status === 400) {
                    toast.error(data.data.message || "Failed to create user", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    });
                    form.reset();
                } else {
                    toast.error("Some Error Occured", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    });
                    form.reset();
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.", {
                    invert: false,
                    duration: 2500
                });
                form.reset();
            }
        }
    }

    return (
        <React.Fragment>
            <main className=' h-screen w-screen overflow-hidden flex flex-row justify-center items-center'>
                <section className=' bg-[#fefefe] max-w-[60vw] max-md:max-w-[100vw] w-full h-screen overflow-hidden flex flex-col justify-center items-center gap-5'>
                    <h1 className=' text-3xl font-bold z-20 max-md:text-black max-md:absolute max-md:top-[15vh] max-md:text-center'>
                        REGISTER
                    </h1>
                    <Card className=' max-w-[30vw] max-md:max-w-[75vw] max-lg:max-w-[40vw] w-full max-md:z-10'>
                        <CardHeader>
                            <CardTitle>REGISTER</CardTitle>
                        </CardHeader>
                        <CardContent className=' flex flex-col gap-4'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input className='placeholder:text-gray-800 border-black' placeholder="John Doe" type='text' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input className='placeholder:text-gray-800 border-black' placeholder="someone@example.com" type='email' {...field} />
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
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input className='placeholder:text-gray-800 border-black' placeholder="password" type='password' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=' w-full h-fit flex items-center justify-center'>
                                        <Button
                                            type="submit"
                                            className='cursor-pointer rounded-sm border border-black hover:bg-white hover:text-black w-full'>
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                            <div className=' w-full h-fit flex items-center justify-between text-base font-medium'>
                                Already have an account? 
                                <a href='/login' className='font-bold text-blue-500 hover:text-blue-700'>
                                    Login
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </section>
                <img
                    src={'/assets/register.jpg'}
                    alt='Register Page'
                    width={1000}
                    height={1000}
                    className='w-full max-w-[40vw] h-screen object-cover max-md:absolute max-md:left-0 max-md:top-0 max-md:z-0 max-md:max-w-[100vw]'
                />
            </main>
        </React.Fragment>
    )
}

export default Register