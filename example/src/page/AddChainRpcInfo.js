import {Button, Col, Form, Input, Row, Table, Select, DatePicker, Tag, Space, List} from 'antd';
import React, {useContext, useEffect, useState} from "react";


export function AddChainRpcInfo(props) {
    const {chainInfo} = props
    const {rpc} = chainInfo
    const [rpcInfo, setRpcInfo] = useState([])

    useEffect(() => {
        async function fetchOrder() {
            const rpcRes = rpc.map(async (url) => {
                const rpcUrl = url.includes('${INFURA_API_KEY}')? url.replace("${INFURA_API_KEY}","9aa3d95b3bc440fa88ea12eaa4456161") : url
                return fetch(rpcUrl, {method: 'HEAD'})
            })
            const res = await Promise.allSettled(rpcRes)
            console.log(res)
            setRpcInfo(res.map((val,index)=>({...val,url:rpc[index]})))
        }

        fetchOrder().catch(err => {
            // message.error(err);
            console.log(err)
        })
    }, []);

    return (

        <List
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={rpcInfo}
            renderItem={(item,index) => (
                <List.Item>
                     {item.url} {item.status}
                </List.Item>
            )}
        />
    );
}



