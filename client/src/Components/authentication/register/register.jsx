import { VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import React, { useState,useEffect } from "react";
import {useHistory} from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  const history = useHistory();
  useEffect(()=>{
    localStorage.clear();
  },[])
  const handleShow = () => {
    setShow(!show)
  }
  const postDetails = (pics) => {
    setLoading(true)
    if (pics === undefined) {
      toast({
        title: 'Please Select Image',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dt72yn7jc")
      axios.post("https://api.cloudinary.com/v1_1/dt72yn7jc/image/upload", data)
        .then(data => {
          setPic(data.data.url.toString());
          setLoading(false);
        }).catch(err => {
          console.log(err);
          setLoading(false);
        })

    } else {
      toast({
        title: 'Please Select Image!',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }
  }
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Kindly fill All Fields.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Kindly fill All Fields.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const { data } = await axios.post("http://localhost:5000/api/user/register", { name, email, password, pic }, config)
      toast({
        title: "Registration SuccessFul",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top"
      })
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      localStorage.setItem("userInfo", JSON.stringify(data))
      history.push("/chats");
      window.location.reload();
      setLoading(false);
    } catch (err) {
      console.log(err)
      toast({
        title:"Error Occured",
        // description:err.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"top"
      })
      setLoading(false);
      console.log(err)
    }
  }

    return (
      <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="Email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
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
        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Comfirm-Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <InputRightElement width="4.5rem" onClick={handleShow}>
              <Button h="1.75rem" size="sm">
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic" >
          <FormLabel>Upload Image(Optional)</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => {
              postDetails(e.target.files[0]);
            }}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >Sign Up</Button>

<Box boxShadow='dark-lg' p='4' rounded='md' bg='white'>
    <Text fontSize='md'> Made By Pavan With lots of ❤️</Text>
  </Box>
      </VStack>
      
    );
  };

  export default Register;
