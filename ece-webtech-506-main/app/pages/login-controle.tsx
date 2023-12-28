import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import supabase from '../utils/supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const Login = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const { data: authListener, subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                const user = session?.user;

                const userDataToStore = {
                    id: user.id,
                    email: user.email,
                };

                localStorage.setItem('userData', JSON.stringify(userDataToStore));
                setUserData(userDataToStore);

                supabase.from('users').upsert([
                    {
                        id: user.id,
                        email: user.email,
                    },
                ]);

                router.push('/profile');

            }
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [router]);

    return (
        <div>
            <h1 className="text-3xl text-center">Bienvenue ! Connectez vous</h1>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Auth
                    supabaseClient={supabase}
                    providers={['google', 'facebook', 'github']}
                    socialLayout="vertical"
                    redirectTo="/profile"
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: 'green',
                                    brandAccent: 'darkgreen',
                                },
                            },
                        },
                    }}
                />
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

        </div>
    );
};

export default Login;
