import { useColorModeValue } from "@chakra-ui/core";
import React from "react";
import styles from './index.module.css';

export default function Pagination({ currentPage, totalPage, onPageChange }) {
   const [pages, setPages] = React.useState([]);
   React.useEffect(() => {
      const margin = 2;
      const pages = [currentPage];
      if (currentPage > 1) {
         for (let i = margin; i > 0; i--) {
            if (currentPage - i > 0) {
               pages.push(currentPage - i);
            }
         }
      }
      if (currentPage < totalPage) {
         for (let i = margin; i > 0; i--) {
            if (currentPage + i <= totalPage) {
               pages.push(currentPage + i);
            }
         }
      }

      setPages(pages.sort((a, b) => a - b));
   }, [totalPage, currentPage])

   const additionalStyle = useColorModeValue({}, { backgroundColor: '#161e2e', borderColor: 'grey' });
   const isDarkMode = useColorModeValue(false, true);

   return (
      <div className={styles.container} >
         <div className={styles.box} style={additionalStyle} onClick={() => onPageChange(1)}>
            {'<<'}
         </div>
         {pages.map((page, i) => {
            let className = `${styles.box}`;
            const isActive = page === currentPage;
            if (isActive && isDarkMode) className += ` ${styles.active}`;
            if (isActive && !isDarkMode) className += ` ${styles.activeBlue}`;
            return (
               <div key={i} className={className} style={additionalStyle} onClick={() => onPageChange(page)}>
                  {page}
               </div>
            )
         })}
         <div className={styles.box} style={additionalStyle} onClick={() => onPageChange(totalPage)}>
            {'>>'}
         </div>

      </div>
   )
}