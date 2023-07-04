import {
    Avatar,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Drawer,
    DrawerOverlay,
    DrawerHeader,
    DrawerContent,
    DrawerBody,
    Input,
    useToast
} from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/spinner';
import { Tooltip, Text } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { ChatState } from '../../contextApi/chatProvioder';
import { useDisclosure } from "@chakra-ui/hooks";
import ProfileModal from "./ProfileModal";
import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from 'axios';
import LoadingSpinner from "../chatLoading/ChatLoading";
import UserListItem from "../userListItems/UserListItem";
import { getSender } from "../../config/chatLogics";

const SideDrawer = () => {
    const history = useHistory()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState()

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const toast = useToast();
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please type in the search",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`http://localhost:5000/api/user/alluser?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (err) {
            console.log(err)
        }

    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            }
            const { data } = await axios.post("http://localhost:5000/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
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
    };
    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push("/")
    }
    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="search user to chat" hasArrow placement="bottom">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text d={{ base: "none", md: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">
                    Chat-O-Chat 💬👩‍❤️‍👨
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>

                            {notification.length>0&& <h2 style={{backgroundColor:"gray",borderRadius:"50%"}}>{notification.length}</h2>}
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No new Messages"}
                            {notification.map(noti => {
                                return(
                                    <MenuItem key={noti._id} onClick={()=>{
                                        setSelectedChat(noti.chat)
                                        setNotification(notification.filter((n)=>n!==noti))
                                    }}>
                                    {noti.chat.isGroupChat ? `new Message ${noti.chat.chatName}` : `new message from ${getSender(user, noti.chat.users)}`}
                                </MenuItem>
                                )
                                
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button}
                            rightIcon={<ChevronDownIcon />}
                        >
                            <Avatar size="sm" cursor="pointer" alt={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="search by name or email"
                                mr={1}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <Button
                                ml={1}
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            searchResult?.map(user => {
                                return (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => { accessChat(user._id) }}
                                    />
                                )
                            })
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>

                </DrawerContent>

            </Drawer>
        </>
    )
}
export default SideDrawer;