// pages/admin/contacts/[id].js
import supabase from '../../supabaseClient'
export async function getServerSideProps({ params }) {
    const { id } = params
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', parseInt(id))
        .single();

    if (error) return { props: { error: 'Error fetching contact' } };

    return { props: { contact: data } }
}

function ContactDetails({ contact }) {
console.log("tetst");
    if (!contact) return <div>

        Contact not found
    </div>

    return (
        <div>
            console.log("tets22");
            <h1>Contact Details</h1>
            <p>Prénom: {contact.lastname}</p>
            <p>Email: {contact.email}</p>
            <p>Message: {contact.message}</p>
        </div>
    )
}

export default ContactDetails
