import { ChatState } from "../contextApi/chatProvioder"
import { Box } from "@chakra-ui/react";
import SingleChat from "./singleChat";
const ChatBox = ({fetChAgain, setFetchAgain})=>{
    const {user,selectedChat } = ChatState()
    
    return(

        <Box
        display={{base:selectedChat?'flex':"none",md:"flex"}}
        alignItems="center"
        flexDir="column"
        p={3}
        h='91.1vh'
        bg='white'
        w={{base:"100%",md:"68%"}}
        borderRadius="lg"
        borderWidth="1px"
        >
            <SingleChat fetChAgain={fetChAgain} setFetchAgain={setFetchAgain}/>
        </Box>
    )
}
export default ChatBox