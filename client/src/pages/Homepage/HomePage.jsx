import React, { useEffect } from "react";
import { Box, Container, Text,Tabs,Tab,TabList,TabPanel,TabPanels } from "@chakra-ui/react";
import Register from "../../Components/authentication/register/register";
import Login from "../../Components/authentication/login/Login";
import { useHistory } from "react-router-dom";
const HomePage = () => {

  const history = useHistory();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if(user){
      history("/chats")
    }

  },[history]);


  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Chat-O-Chat 💬💑
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" textColor="black">
        <Tabs variant="soft-rounded" >
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
          </TabPanel>
            <TabPanel>
              <Register/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
