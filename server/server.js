import { Server } from "socket.io";

import * as dotenv from "dotenv";
dotenv.config();

import Connection from "./databse/db.js";

import { getDocument, updateDocument } from "./controller/documentController.js";

const PORT = process.env.PORT || 9000;
const BASE_URL=process.env.BASE_URL;

Connection(process.env.URL);

const io=new Server(PORT, {
    cors: {
        origin:`${BASE_URL}`,
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
