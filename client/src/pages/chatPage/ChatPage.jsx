import React from 'react';
import {Box} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../contextApi/chatProvioder';
import SideDrawer from '../../Components/miscellanious/SideDrawer';
import MyChats from '../../Components/Mychats';
import ChatBox from '../../Components/ChatBox';
const ChatPage = () => {
  const [fetChAgain,setFetchAgain] = useState(false)
  const {user} = ChatState();
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box
        display='flex'
        justifyContent='space-between'
        w="100%"
        h='91.vh'
        p="10px"
      >
        
          {user && <MyChats/>}
          {user && (
            <ChatBox fetChAgain={fetChAgain} setFetchAgain={setFetchAgain}/>
          )}  
      </Box>
    </div>
  )
}

export default ChatPage;
