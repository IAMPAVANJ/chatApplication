import React,{ useEffect, useState } from "react";
import { Box, IconButton, Spinner, Text,FormControl, Input, useToast } from "@chakra-ui/react";
import { ChatState } from "../contextApi/chatProvioder";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender,getSenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellanious/ProfileModal";
import UpdateGroupChatModal from "./miscellanious/UpdateGroupChatModal";
import axios from 'axios';
import ScrollableChat from "./ScrollableChats";
import "./style.css";
import io from 'socket.io-client';
import { useLottie } from "lottie-react";
import animationData from "../animation/typing.json"
const ENDPOINT = "127.0.0.1:5000";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification,setNotification } = ChatState();
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState();
    const [socketConnected,setSocketConnected] = useState(false);
    const [typing,setTyping] = useState(false);
    const [isTyping,setIsTyping] = useState(false);


    const defaultOptions= {
        loop:true,
        autoplay:true,
        animationData:animationData,
        rendererSettings:{
            preserveAspectRatio:"xMidYMid slice",
        },
    };

    const {view} = useLottie(defaultOptions);
    
    const toast = useToast();


    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit('setup',user)
        socket.on("connected",()=>{
            setSocketConnected(true);
        })

        socket.on('typing',()=>setIsTyping(true))
        socket.on('stop typing',()=>setIsTyping(false))

    },[]) 

    const fetchMessages = async()=>{
        if(!selectedChat){
            return;
        }

        try{
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            setLoading(true)

            const {data} = await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`,config);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat',selectedChat._id)
        }catch(err){
            console.log(err);
            toast({
                title:"Error Occured",
                description:"Failed To load the messages",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
            })
                setLoading(false);
        }
    }

    useEffect(()=>{
        fetchMessages()

        selectedChatCompare = selectedChat;
    },[selectedChat])


    useEffect(()=>{
        socket.on("message Received",(newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                //give notification
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
                setMessages([...messages,newMessageReceived]);
            }
        })
        
    })

    const sendMessage = async(event)=>{
        if(event.key === "Enter" && newMessage){
            socket.emit('stop typing',selectedChat._id)
            try{
                const config = {
                    headers:{
                        "Content-type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }

                const {data} = await axios.post("http://localhost:5000/api/messages/create",{
                    content:newMessage,
                    chatId:selectedChat._id
                },config)
                setNewMessage("");
                socket.emit('new message',data)
                setMessages([...messages,data])

            }catch(err){
                console.log(err)

            }
        }
    };

   

    const typingHandler = (e)=>{
        setNewMessage(e.target.value)
         if(!socketConnected){
            return;
         }
         if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
         }

         let lastTypingTime = new Date().getTime();
         var timerLength = 3000;
         setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing',selectedChat._id);
                setTyping(false);
            }
            
         },timerLength)
    };

    return (
        <>
            { selectedChat?(<>
            <Text
            fontSize={{base:"28px",md:"30px"}}
            pb={3}
            px={2}
            w='100%'
            fontFamily="Work sans"
            display="flex"
            justifyContent={{base:"space-between"}}
            alignItems="center"
            >
                <IconButton
                display={{base:"flex",md:"none"}}
                icon={<ArrowBackIcon/>}
                onClick={()=>{setSelectedChat()}}
                />
                {!selectedChat.isGroupChat ? (
                    <>
                    {getSender(user,selectedChat.users)}
                    <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                    </>
                ):(
                    <>{selectedChat.chatName.toUpperCase()}
                    {<UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                    />}
                    </>
                )}
            </Text>
            <Box 
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg='#E8E8E8'
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {loading?(
                    <Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                    />
                ):(<div className="messages">
                    <ScrollableChat messages={messages}/>
                </div>)}

                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <div>Typing...</div>:<></>}
                        <Input
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message..."
                        onChange={typingHandler}
                        value={newMessage}
                        />
                    </FormControl>

            </Box>
            </>):(<Box display="flex" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    click to Start Chat
                </Text>
            </Box>) }
        </>
    )
}
export default SingleChat;