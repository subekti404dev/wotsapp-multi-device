import { Box, useColorModeValue } from '@chakra-ui/core';

const Logout = (props) => {
   const color = useColorModeValue('#4b5563', 'white');
   return (
      <Box
         as="svg"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         viewBox="0 0 1000 1000"
         padding={"2px"}
         {...props}
      >
         <path
            fill={color}
            d="M696.5 234.1V68.9c0-26.4-21.6-47.9-47.9-47.9H57.9C31.6 21 10 42.5 10 68.9v676.8c0 17.5 10.4 34.3 25.5 42.3l364 188.4c16 7.9 35.1-3.2 35.1-21.6V771.3h213.9c26.4 0 47.9-21.6 47.9-47.9V461.6h-95.8v190c0 13.6-10.3 24-23.9 24H435.5V269.2c0-17.5-10.4-34.3-25.6-42.3L195.2 116.7h381.6c13.6 0 23.9 10.4 23.9 24v94.2h95.8L696.5 234.1L696.5 234.1z" />
         <path
            fill={color}
            d="M819.4 155.8l155.7 155.7c19.9 20 19.9 49.5 0 69.4L819.4 536.6c-20 19.9-50.3 20.7-70.3 0.8c-19.1-19.2-16.8-51.1 1.6-70.3l70.2-69.4H548.8c-13.6 0-27.2-5.6-35.9-16c-22.4-23.9-16.8-66.3 12-82.2c7.2-4 16-6.4 24-6.4H821c0 0-69.4-69.5-70.2-69.5c-18.4-18.3-20.7-51.1-1.6-69.4C768.3 135.1 799.4 135.9 819.4 155.8" />
      </Box>
   );
}

export default Logout;
