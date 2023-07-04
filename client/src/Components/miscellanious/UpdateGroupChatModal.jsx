import { ViewIcon } from "@chakra-ui/icons";
import {
    useDisclosure,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    IconButton,
    ModalHeader,
    Button,
    Box,
    FormControl,
    Input,
    ModalCloseButton
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../contextApi/chatProvioder";
import { Spinner } from '@chakra-ui/react'
import UserListItem from "../userListItems/UserListItem";
import { Text } from "@chakra-ui/react";
import UserBadgeItem from "../userListItems/UserBadgeItem";
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [renameLoading, setRenameLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleRemove = async(user1) => {

        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title: "Only Admin can Remove someOne!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try{
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('http://localhost:5000/api/chat/remove',{
                chatId:selectedChat._id,
                userId:user1._id
            },config)

            user1._id === user._id ? setSelectedChat(): setSelectedChat(data);

            setFetchAgain(!fetchAgain)
            setLoading(false);
            fetchMessages();
        
        }catch(err){
            toast({ 
                title:"Error Occured",
                description:err.response.data.message,
                isClosable:true,
                duration:4000,
                position:'top'
            });
            setLoading(false);
        }

    }
    const handleAddUser = async(user1) => {
        if(selectedChat.users.find((u)=>u._id === user1._id)){
            toast({
                title: "User Already available in List",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only Admin can Add The users",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        try{
            setLoading(true)

            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('http://localhost:5000/api/chat/addGroup',{
                chatId:selectedChat._id,
                userId:user1._id
            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false);
        }catch(err){
            console.log(err)
            toast({
                title: "Error Occured",
                description:err.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            })
            setLoading(false);
        }

    }


    const handleRename = async() => {
        if(!groupChatName){
            return;
        }

        try{
            setRenameLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.put("http://localhost:5000/api/chat/rename",{
                chatId:selectedChat._id,
                chatName:groupChatName
            },config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
            window.location.reload(false);
        }catch(err){
            console.log(err)
            setRenameLoading(false)
            toast({
                title: err.response.data,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            setGroupChatName("")
        }
    }
    const handleSearch=async(query)=>{
        
        setSearch(query)
        if(!query){
            return;
        }

        try{
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`http://localhost:5000/api/user/alluser?search=${search}`,config)
            setLoading(false)
            setSearchResults(data);
        }catch(err){
            console.log(err)
            toast({
                title: err.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
        }
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        
                        <FormControl display="flex" flexDir="row">
                            <Input
                                placeholder="Group Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                m={1}
                                onClick={handleRename}
                                isLoading={renameLoading}
                            >
                                Update Name
                            </Button>
                           
                        </FormControl>
                        <FormControl>
                                <Input
                                    placeholder="Add User to group"
                                    mb={1}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </FormControl>
                            {loading?(<Spinner size="lg"/>):(
                                searchResults.slice(0,4)?.map((u)=>(
                                    <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={()=>handleAddUser(u)}
                                    />
                                ))
                            )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' onClick={()=>handleRemove(user)}>
                            Leave Group
                        </Button> 
                    </ModalFooter>
                    <ModalBody>
                    <Box display="flex" flexWrap='wrap' w="100%">
                        <Text fontSize='3xl'>
                            Members In Group
                        </Text>
                        {selectedChat.users.map(u => (
                                <UserBadgeItem key={u._id} handleDelete={() => handleRemove(u)} user={u} />
                            ))}
                            {selectedChat.users.map(u => (
                                <UserListItem key={u._id} handleFunction={() => handleRemove(u)} user={u} />
                            ))}
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal;