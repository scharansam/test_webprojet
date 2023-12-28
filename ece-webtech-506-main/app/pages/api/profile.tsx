export default function handeler(req,res){
    if(req.method === 'GET'){
        const user ={
            username: 'johndoe',
            email: 'johndoe@example.com'
        };

        res.status(200).json(user);
    }else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}