import { useState, useEffect } from 'react';
import { timestampToStrDate } from '@/utils/timestamp';
import { toast } from 'react-toastify';

export function useLogs() {
    const [data, setData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = async (page) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/messages?page=${page}&q=${keyword}`);
            const messages = await res.json();
            setData((messages.data || []).map(m => ({ ...m, jid: m.jid.split("@")[0], timestamp: timestampToStrDate(m.timestamp) })));
            setTotalPage(messages.total % 20 === 0 ? messages.total / 20 : Math.floor(messages.total / 20) + 1);
            setPage(page);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.message, { autoClose: 5000 });
        }
    };

    useEffect(() => {
        fetchData(1);
    }, [keyword])

    return [
        {
            messages: data,
            totalPage,
            page,
            keyword,
            loading
        },
        {
            setPage: async (p) => {
                await fetchData(p);
            },
            setKeyword: async (k) => {
                setKeyword(k);
            }
        }
    ];
}