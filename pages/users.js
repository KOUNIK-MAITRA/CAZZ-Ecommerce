import Head from 'next/head'
import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'

const Users = () => {
    const { state, dispatch } = useContext(DataContext)
    const { users, auth, modal } = state

    if (!auth.user) return null;
    return (
        <div className="col-md-12 user-details py-3" >
            <div className="table-responsive" style={{ paddingTop: "78px", width: "100%" }}>
                <Head>
                    <title>Users</title>
                </Head>

                <table className="table-bordered table-hover w-100">
                    <thead>
                        <tr>
                            <td className="p-2 text-center"></td>
                            <td className="p-2 text-center">ID</td>
                            <td className="p-2 text-center">Avatar</td>
                            <td className="p-2 text-center">Name</td>
                            <td className="p-2 text-center">Email</td>
                            <td className="p-2 text-center">Admin</td>
                            <td className="p-2 text-center">Action</td>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            users.map((user, index) => (
                                <tr key={user._id} style={{ cursor: 'pointer' }}>
                                    <td className="p-2 text-center">{index + 1}</td>
                                    <td className="p-2">{user._id}</td>
                                    <td className="p-2 text-center">
                                        <img src={user.avatar} alt={user.avatar}
                                            style={{
                                                width: '30px', height: '30px',
                                                overflow: 'hidden', objectFit: 'cover'
                                            }} />
                                    </td>
                                    <td className='text-center'>{user.name}</td>
                                    <td className='text-center'>{user.email}</td>
                                    <td className='text-center'>
                                        {
                                            user.role === 'admin'
                                                ? user.root ? <i className="fas fa-check text-success"> Root</i>
                                                    : <i className="fas fa-check text-success"></i>

                                                : <i className="fas fa-times text-danger"></i>
                                        }
                                    </td>
                                    <td className="text-center">
                                        <Link href={
                                            auth.user.root && auth.user.email !== user.email
                                                ? `/edit_user/${user._id}` : '#!'
                                        }>
                                            <a><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                        </Link>

                                        {
                                            auth.user.root && auth.user.email !== user.email
                                                ? <i className="fas fa-trash-alt text-danger ml-2" title="Remove"
                                                    data-toggle="modal" data-target="#exampleModal"
                                                    onClick={() => dispatch({
                                                        type: 'ADD_MODAL',
                                                        payload: [{ data: users, id: user._id, title: user.name, type: 'ADD_USERS' }]
                                                    })}></i>

                                                : <i className="fas fa-trash-alt text-danger ml-2" title="Remove"></i>
                                        }

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default Users