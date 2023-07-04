import React, { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios";
import {useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  useEffect(()=>{
    localStorage.clear();
  },[])
  const handleShow = () => {
    setShow(!show);
  };
  const submitHandler = async () => {
    setLoading(true)
    if (!email || !password) {
      toast({
        title: "Enter Details",
        status: "warning",
        duration: 4000,
        isClosable: true
      })
    } else {
      let regEx = /^[A-Za-z0-9-/./_]+\@[A-Za-z0-9-/./_]+\.([A-Za-z]{2,3})$/
      const check = regEx.test(email)
      if (check === true) {
        try {
          const config = {
            headers: {
              "Content-type": "application/json"
            }
          }

          const { data } = await axios.post("http://localhost:5000/api/user/login", { email, password }, config);
          if (!data) {
            setLoading(false)
          }
          localStorage.setItem("userInfo", JSON.stringify(data))
         
          history.push("/chats");
          window.location.reload();
        } catch (err) {
          console.log(err)
          setLoading(false)
          toast({
            title: "Error Occured",
            description: err.response.data.message,
            status: "error",
            duration: 4000,
            isClosable: true
          })
        }
      } else {
        setLoading(false);
        toast({
          title: "Enter Correct EmailId",
          status: "error",
          duration: 4000,
          position: "top",
          isClosable: true
        })
      }
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="Email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem" onClick={handleShow}>
            <Button h="1.75rem" size="sm">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        isLoading={loading}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        LogIn
      </Button>
      {/* <Button
        colorScheme="red"
        variant="solid"
        width="100%"
        onClick={() => { setEmail("guest@onpassive.com"); setPassword("onpassive") }}
      >
        Enter As a Guest
      </Button> */}
      <Box boxShadow='dark-lg' p='4' rounded='md' bg='white'>
    <Text fontSize='md'> Made By Pavan With lots of ❤️</Text>
  </Box>
    </VStack>
  );
};

export default Login;
