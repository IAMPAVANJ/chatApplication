import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    Button,
    ModalHeader,
    useToast,
    Input,
    Box
} from "@chakra-ui/react";
import axios from "axios";
import { FormControl } from "@chakra-ui/form-control";
import { ChatState } from "../../contextApi/chatProvioder";
import UserListItem from "../userListItems/UserListItem";
import UserBadgeItem from "../userListItems/UserBadgeItem";
const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { user, chats, setChats } = ChatState();
    const handleSearch = async (query) => {
        console.log(query)
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`http://localhost:5000/api/user/alluser?search=${query}`, config);
            console.log(data)
            setLoading(false)
            setSearchResult(data);
        } catch (err) {
            console.log(err)
            toast({
                title: "Error Occured! ",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }
    const handleSubmit = async() => { 
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the fields",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
        }
        try{
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
        
            const {data} = await axios.post('http://localhost:5000/api/chat/group',{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id))
            },config);
            console.log(data)
            setChats([data,...chats])
            onClose();
            toast({
                title: "Group Created Successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            })


        }catch(err){
            console.log(err)
            
            toast({
                title: err.response.data,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })

        }
    };
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(sel=>sel._id !== delUser._id))  
    };
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already in Group",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
        console.log(selectedUsers);
    };
 
    
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems='center'
                    >
                        <FormControl>
                            <Input placeholder="Group Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users eg: sneha, pavan and their kids" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

        

                        <Box
                        w="100%" display='flex' flexWrap="wrap"
                        >
                            {selectedUsers.map(u => {
                                return (
                                    <UserBadgeItem key={user._id} handleDelete={()=>handleDelete(u)} user={u}  />
                                )
                            })}
                        </Box>
                        {loading ? <div>Loading Please Wait...</div> : (
                            searchResult.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit} w="100px">
                            Create group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default GroupChatModal