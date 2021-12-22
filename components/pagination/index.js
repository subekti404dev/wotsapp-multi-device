import { useColorModeValue } from "@chakra-ui/core";
import React from "react";
import styles from './index.module.css';

export default function Pagination({ currentPage, totalPage, onPageChange }) {
    const [pages, setPages] = React.useState([]);
    React.useEffect(() => {
        const pages = [];
        if (currentPage > 1) {
            const pageMinusOne = currentPage - 1;
            const pageMinusTwo = currentPage - 2;

            console.log({ pageMinusOne, pageMinusTwo });
            if (pageMinusOne > 0) {
                pages.push(pageMinusOne);
            }
            if (pageMinusTwo > 0) {
                console.log(pageMinusTwo);
                pages.push(pageMinusTwo);
            }
        }
        pages.push(currentPage);
        if (currentPage < totalPage) {
            if (currentPage + 1 <= totalPage) {
                pages.push(currentPage + 1);
            }

            if (currentPage + 2 <= totalPage) {
                pages.push(currentPage + 2);
            }
        }
        console.log(pages);
        setPages(pages);
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