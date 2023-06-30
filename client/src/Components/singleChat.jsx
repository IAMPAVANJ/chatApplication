import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../contextApi/chatProvioder";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender,getSenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellanious/ProfileModal";
import UpdateGroupChatModal from "./miscellanious/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
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
                Messages are getting here
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