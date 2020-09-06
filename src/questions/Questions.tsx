import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { getQuestions } from './QuestionSlice';
import { Modal, Button } from 'react-bootstrap';
// used InfiniteScroll Use for lazy load functionality
import InfiniteScroll from 'react-infinite-scroll-component';
import { QuestionData } from './QuestionStore';

const Questions = ({ getQuestions }: any) => {

    // get Store Data
    const store = useSelector((state: any) => state);
    // for setOffeset
    const [offset, setOffset] = useState(0);
    // for Set Show
    const [show, setShow] = useState(false);
    // for title
    const [title, setTitle] = useState('');
    // For Link
    const [link, setLink] = useState('');
    // for Markup
    const [markup, setMarkup] = useState({ __html: '' });

    // Page Size initially 15
    const PAGESIZE = 15;

    useEffect(
        () => {
            const test = async () => {
                // Get Initial Call i.e 0 page
                await getPage(0)
            }
            test()
        }, [offset]
    );

    // Modal Close
    const handleClose = () => setShow(false);

    // Click Handle
    function handleClick(title: string, body: string, link: string) {
        setTitle(title);
        setMarkup({ __html: body });
        setLink(link);
        setShow(true);
    }

    // Get Question Call
    const getPage = async (offset: number) => {
        const page = (offset / PAGESIZE) + 1;
        let result: QuestionData[] = [];
        fetch("https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow&filter=withbody&page=" + page + "&pagesize=" + PAGESIZE)
            .then(res => res.json())
            .then(
                async (res) => {
                    const data = res
                    for (let i = 0; i < data.items.length; i++) {
                        let q = {
                            author: data.items[i].owner.display_name,
                            title: data.items[i].title,
                            creationDate: data.items[i].creation_date,
                            body: data.items[i].body,
                            link: data.items[i].link
                        }
                        result.push(q)
                    }
                    // Final result
                    getQuestions(result)
                },
                (error) => {
                    console.log("error")
                }
            )

    }

    // Fetch Data
    function fetchData() {
        setOffset(offset + PAGESIZE);
        const test = async () => {
            await getPage(offset);
        }
        test();
    }

    return (
        <div className="container" >
            <div className="row justify-content-center">
                <h1 className="">Stack Overflow Questions</h1>
            </div>
            <div className="row mb-2">
                <div className="col-md-2 badge badge-dark"><h6>Author</h6></div>
                <div className="col-md-6 badge badge-dark"><h6>Title</h6></div>
                <div className="col-md-4 badge badge-dark"><h6>Creation Date</h6></div>
            </div>
            <InfiniteScroll
                dataLength={store.QuestionReducer.length}
                next={fetchData}
                hasMore={true}
                loader={<div></div>}
                scrollableTarget="scr">
                <div id="scr" style={{ height: "400px", overflowY: "scroll", overflowX: "hidden" }}>
                    {store.QuestionReducer.map((s: any) => {
                        return (
                            <div className="row" onClick={() => handleClick(s.title, s.body, s.link)}>
                                <div className="col-md-2">{s.author}</div>
                                <div className="col-md-6">{s.title}</div>
                                {/* toUTCString used for convert creationDate */}
                                <div className="col-md-4">{new Date(s.creationDate).toUTCString()}</div>
                            </div>
                        )
                    })}
                </div>
            </InfiniteScroll>
            {/* Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div dangerouslySetInnerHTML={markup} />
                    <p />
                    <a href={link} target='_blank' rel='noopener noreferrer'>{link}</a>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default connect(null, { getQuestions })(Questions);
