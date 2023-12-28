import {useSupabaseClient} from "@supabase/auth-helpers-react";
import React, {useEffect, useState} from "react";
import Link from "next/link";



export default function Contects() {

    const supabase = useSupabaseClient();
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const { data, error } = await supabase
                .from('contacts')
                .select('*');

            if (error) console.log('Error', error);
            else setContacts(data);
        };
        fetchContacts();
    }, [supabase]);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData.entries());

        const {data: insertData, error: insertError} = await supabase
            .from('contacts')
            .insert([formProps]);

        if (insertError) {
            console.log('Error', insertError);
        } else {
            console.log('Inserted Data', insertData);
            form.reset(); // Reset the form after successful insertion
        }
    };



    /*
        const handleSubmit = async (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            const formProps = Object.fromEntries(formData.entries());

            const { data: insertData, error: insertError } = await supabase
                .from('contacts')
                .insert([
                    { firstname: "tt" , lastname: 'Doe', email: 'jane.doe@example.com', message: 'Hello World' }
                ]);

            if (insertError) {
                console.log('Error', insertError);
            } else {
                console.log('Inserted Data', insertData);
                form.reset();
            }
        };
    */






    return (

        <div className=" px-6 py-24 sm:py-32 lg:px-8 ">

            <p className="text-slate-500">LISTE DES CONTACT  :</p>
            {contacts.map((contact) => (
                <tr key={contact.email}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{contact.firstname}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{contact.lastname}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{contact.email}</td>
                    <td>
                    </td>
                </tr>
            ))}
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    Vous pouvez enregistrer vos cordonner !
                </p>
            </div>
            <form onSubmit={handleSubmit}  method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                            Nom
                        </label>
                        <div className="mt-2.5">
                            <input id="tt"
                                   type="text" name="firstname" placeholder="Prénom" required
                                   className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                            Prenom
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text" name="lastname" placeholder="Nom de famille" required
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="email" name="email" placeholder="Email" required
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                            Message
                        </label>
                        <div className="mt-2.5">
                              <textarea
                                  name="message" placeholder="Votre message" required
                                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  defaultValue={''}
                              />
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"

                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Envoyer
                    </button>
                </div>
            </form>
        </div>

    )
}
