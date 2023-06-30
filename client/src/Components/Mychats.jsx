import React, { useEffect, useState } from "react";
import { ChatState } from "../contextApi/chatProvioder";
import {
    useToast,
    Button,
    Text
} from "@chakra-ui/react";
import { Box, Stack } from '@chakra-ui/layout';
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import LoadingSpinner from './chatLoading/ChatLoading';
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./miscellanious/GroupChatModal";
const MyChats = () => {

    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast();
    
    const fetchChat = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get("http://localhost:5000/api/chat", config)
            console.log(data)
            setChats(data)
        } catch (err) {
            console.log(err)
            toast({
                title: "Error fetching User data ",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChat();
    }, [])



    return (

        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            h="calc(91.1vh)"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work Sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems='center'
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => {
                            return <Box
                                onClick={() => { setSelectedChat(chat) }}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "#white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : (
                                        chat.chatName
                                    )}
                                </Text>
                            </Box>
                        })}
                    </Stack>
                ) : (
                    <LoadingSpinner />
                )}
            </Box>
        </Box>

    )
}
export default MyChats;