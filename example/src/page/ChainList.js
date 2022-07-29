import {Button, Col, Form, Input, Row, Table, Select, DatePicker, Tag, Space} from 'antd';
import React, {useContext, useEffect, useState} from "react";
import {Context} from '../AppContext'
import Avatar from "antd/es/avatar/avatar";
import Modal from "antd/es/modal/Modal";
import {AddChainRpcInfo} from "./AddChainRpcInfo";

// import {transformDate, transformTime} from "../js/helper";
// https://github.com/ethereum-lists/chains

export function ChainList() {
    const [orders, setOrders] = useState([])
    const [chainInfo, setChainInfo] = useState({})

    console.log(chainInfo)
    const defaultExpandable = {
        expandedRowRender: (record) => (
            [<a key={record.chainId}> TokenId:{record.chainId} {record.name}</a>])
    };
    const [expandable, setExpandable] = useState(
        defaultExpandable,
    );

    const handleExpandChange = (enable) => {
        console.log(enable)
        setExpandable(enable ? defaultExpandable : undefined);
    };

    const expandedRowRender = (record) => {
        return <Table columns={columns} dataSource={record.testChain} pagination={false}/>;
    }

    const addChain =   (item) => {
        // setIsModalVisible(true);
        setChainInfo(item)
    }

    const columns = [
        {
            title: 'name',
            dataIndex: 'name'
        },
        {
            title: 'chain',
            dataIndex: 'chain'
        }, {
            title: 'nativeCurrency',
            dataIndex: 'nativeCurrency',
            render: (text, record) => ([<Tag>{text.symbol} </Tag>])
        },
        {
            title: 'shortName',
            dataIndex: 'shortName',
            render: (text, record) => (<a>{text}</a>)
        },
        {
            title: 'chainId',
            dataIndex: 'chainId'
        },
        {
            title: 'Action',
            dataIndex: 'state',
            render: (text, record) => (<Button onClick={() => addChain(record)}>AddChain</Button>)
        }
    ];

    useEffect(() => {
        async function fetchOrder() {
            // const res = await fetch("https://chainid.network/chains_mini.json")
            const res = await fetch("https://chainid.network/chains.json")
            const chainList = await res.json()
            // const chains = chainList.filter(val => val.rpc.length > 0  && val.infoURL && !val.rpc[0].indexOf('https'))
            const chains = chainList.filter(val => val.rpc.length > 0
                && val?.explorers && val?.explorers.length > 0
                && val.infoURL && !val.rpc[0].indexOf('https'))
            const faucet = "https://free-online-app.com/faucet-for-eth-evm-chains/"
            const testChain = chains.filter(val => val.faucets.length > 0 && val.faucets[0] != faucet && !val.name.toLowerCase().includes('main'))
            let mainChain = chains.filter(val => !val.name.toLowerCase().includes('test'))
            mainChain = mainChain.filter(val => val.faucets.length == 0 || val.faucets[0] == faucet)
            const allChain = mainChain.map(val => {
                return {
                    ...val,
                    testChain: testChain.filter(chain => chain.chain == val.chain)
                }
            }).filter(val => val.testChain.length > 0)

            console.log(allChain)
            console.log("testChain", testChain)
            console.log("mainChain", mainChain)
            setOrders(allChain)
        }

        fetchOrder().catch(err => {
            // message.error(err);
            console.log(err)
        })
    }, []);

    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleOk = () => {
        // setIsModalVisible(false);
        setChainInfo({})
    };

    const handleCancel = () => {
        // setIsModalVisible(false);
        setChainInfo({})
    };

    return (
        <div>
            <Table columns={columns}
                   expandable={{
                       expandedRowRender,
                       defaultExpandedRowKeys: ['0'],
                   }}
                   rowKey={'chainId'}
                   dataSource={orders}
                   size="middle"/>

            {chainInfo.rpc && <Modal title="Basic Modal" visible  onOk={handleOk} onCancel={handleCancel}>
                {/*{chainInfo.rpc.map(val=>(<p>{val}</p>))}*/}
                <AddChainRpcInfo chainInfo={chainInfo} />
            </Modal>}
        </div>
    );
}



