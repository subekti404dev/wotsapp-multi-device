import { useColorModeValue } from '@chakra-ui/core';


function Row({ headers, data }) {
    const rowBgColor = useColorModeValue('white', '#171923');

    return (
        <tr>
            {headers.map((header, index) => {
                const ContentWrapper = header.contentWrapper;
                return (
                    <td key={index} style={{ backgroundColor: rowBgColor }} data-label={header.label}>
                        {!Boolean(ContentWrapper) && data[header.value]}
                        {Boolean(ContentWrapper) && <ContentWrapper data={data[header.value]} />}
                    </td>
                )
            })}

            {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
            <TableDropdown />
          </td> */}
        </tr>)

}

export default function Table({ title, rows, headers }) {
    const rowBgColor = useColorModeValue('white', '#171923');

    return (
        <table>
            {title && <caption>{title}</caption>}
            <thead>
                <tr style={{ backgroundColor: rowBgColor }}>
                    {(headers || []).map((header, index) => (
                        <th scope="col" key={index}>{header.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {(rows || []).map((row, index) => (<Row headers={headers} data={row} key={index} />))}
            </tbody>
        </table>
    )
} 