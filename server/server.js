import { Server } from "socket.io";

import Connection from "./databse/db.js";

import { getDocument, updateDocument } from "./controller/documentController.js";

const PORT = process.env.PORT || 9000;

const URL="mongodb://sinhasada9:Luck4396@ac-giglg7o-shard-00-00.npu2ghp.mongodb.net:27017,ac-giglg7o-shard-00-01.npu2ghp.mongodb.net:27017,ac-giglg7o-shard-00-02.npu2ghp.mongodb.net:27017/?ssl=true&replicaSet=atlas-6jhvx8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Google-Docs-Clone"

Connection(URL);

const io=new Server(PORT, {
    cors: {
        origin:"http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })
});
