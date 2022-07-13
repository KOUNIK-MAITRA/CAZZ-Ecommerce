import Head from 'next/head'
import { useState, useContext, useEffect, useRef } from 'react'
import { DataContext } from '../../store/GlobalState'
import { imageUpload } from '../../utils/imageUpload'
import { postData, getData, putData } from '../../utils/fetchData'
import { useRouter } from 'next/router'

const ProductsManager = () => {
    const editorRef = useRef()
    const [editorLoaded, setEditorLoaded] = useState(false)
    const { CKEditor, ClassicEditor } = editorRef.current || {}
    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        }
        setEditorLoaded(true)
    }, []);
    const initialState = {
        title: '',
        price: 0,
        size: {
            S: 0,
            M: 0,
            L: 0,
            XL: 0,
            XXL: 0,
            other: 0,
        },
        inStock: 0,
        description: '',
        content: '',
        category: "all"
    }
    const [product, setProduct] = useState(initialState)
    const { title, price, size, inStock, description, content, category } = product
    const { S, M, L, XL, XXL, other } = size;
    const [images, setImages] = useState([])
    const [editorContent, seteditorContent] = useState("")

    const { state, dispatch } = useContext(DataContext)
    const { categories, auth } = state

    const router = useRouter()


    const [onEdit, setOnEdit] = useState(false)


    const id = router.query.id;

    useEffect(() => {

        if (id) {
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                if (res.product) {
                    // console.log(res.product.content)
                    setProduct({
                        title: res.product.title,
                        price: res.product.price,
                        size: {
                            S: res.product.size.S,
                            M: res.product.size.M,
                            L: res.product.size.L,
                            XL: res.product.size.XL,
                            XXL: res.product.size.XXL,
                            other: res.product.size.other,
                        },
                        inStock: res.product.inStock,
                        description: res.product.description,
                        content: "",
                        category: res.product.category
                    });
                    seteditorContent(res.product.content)
                    setImages(res.product.images);

                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
            seteditorContent("")

        }
    }, [id])




    const handleChangeInput = e => {
        const { name, value } = e.target

        setProduct({ ...product, [name]: value });
        dispatch({ type: 'NOTIFY', payload: {} })

    }

    const handleChangeEditorInput = (e, editor) => {
        const data = editor.getData();
        setProduct({ ...product, content: data });
        seteditorContent(data);
    }

    const handleChangeSize = e => {
        const { name, value } = e.target
        const sizeObj = { ...product.size, [name]: value }


        setProduct({ ...product, size: sizeObj });


        dispatch({ type: 'NOTIFY', payload: {} })

    }


    const handleUploadInput = e => {
        dispatch({ type: 'NOTIFY', payload: {} })
        let newImages = []
        let num = 0
        let err = ''
        const files = [...e.target.files]

        if (files.length === 0)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Files does not exist.' } })

        files.forEach(file => {
            if (file.size > 5120 * 5120)
                return err = 'The largest image size is 5mb'

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return err = 'Image format is incorrect.'

            num += 1;
            if (num <= 6) newImages.push(file)
            return newImages;
        })

        if (err) dispatch({ type: 'NOTIFY', payload: { error: err } })

        const imgCount = images.length
        if (imgCount + newImages.length > 6)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Select up to 6 images.' } })
        setImages([...images, ...newImages])
    }

    const deleteImage = index => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleStockClick = () => {

        const totalStocks = document.getElementById("totalInstocks").value;

        setProduct({ ...product, inStock: totalStocks });
        if (product.inStock) { dispatch({ type: 'NOTIFY', payload: { success: 'Total stocks successfully set.' } }) }
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        if (auth.user.role !== 'admin')
            return dispatch({ type: 'NOTIFY', payload: { error: 'Authentication is not valid.' } })

        if (!title || !price || !description || !content || !category || !size || images.length === 0) {

            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all the fields.' } })

        }
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        let media = []
        const imgNewURL = images.filter(img => !img.url)
        const imgOldURL = images.filter(img => img.url)

        if (imgNewURL.length > 0) media = await imageUpload(imgNewURL)

        let res;
        if (onEdit) {
            res = await putData(`product/${id}`, { ...product, images: [...imgOldURL, ...media] }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        } else {
            res = await postData('product', { ...product, images: [...imgOldURL, ...media] }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        }

        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

    }

    return (
        <div className="products_manager">
            <Head>
                <title>Products Manager</title>
            </Head>
            <form className="row" onSubmit={handleSubmit}>
                <div className="col-md-6">

                    <input type="text" name="title" value={product.title}
                        placeholder="Title" className="d-block my-4 w-100 p-2"
                        onChange={handleChangeInput} />

                    <div className="row">
                        <div className="col-sm-6">
                            <label htmlFor="price">Price</label>
                            <input type="number" name="price" value={price}
                                placeholder="Price" className="d-block w-100 p-2"
                                onChange={handleChangeInput} min="0" />
                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="price">In Stock</label>
                            <input type="number" id="totalInstocks" name="inStock" value={Number(S) + Number(M) + Number(L) + Number(XL) + Number(XXL) + Number(other)}
                                placeholder="inStock" className="d-block w-100 p-2"
                                onChange={handleStockClick} />
                            <div className='btn btn-dark my-3' onClick={handleStockClick} readonly> set stock</div>
                        </div>
                    </div>
                    <div className="input-group-prepend px-0 my-2">
                        <select name="category" id="category" value={category}
                            onChange={handleChangeInput} className="custom-select text-capitalize">
                            <option value="all">All Products</option>
                            {
                                categories.map(item => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))
                            }
                        </select>

                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="price">S</label>
                        <input type="number" name="S" value={S}
                            placeholder="S" className="d-block w-100 p-2"
                            onChange={handleChangeSize} min="0" />
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="price">M</label>
                        <input type="number" name="M" value={M}
                            placeholder="M" className="d-block w-100 p-2"
                            onChange={handleChangeSize} min="0" />
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="price">L</label>
                        <input type="number" name="L" value={L}
                            placeholder="L" className="d-block w-100 p-2"
                            onChange={handleChangeSize} min="0" />
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="price">XL</label>
                        <input type="number" name="XL" value={XL}
                            placeholder="XXL" className="d-block w-100 p-2"
                            onChange={handleChangeSize} min="0" />
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="price">XXL</label>
                        <input type="number" name="XXL" value={XXL}
                            placeholder="XXL" className="d-block w-100 p-2"
                            onChange={handleChangeSize} min="0" />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="price">other</label>
                        <input type="number" name="other" value={other}
                            placeholder="other" className="d-block w-100 p-2"
                            onChange={handleChangeSize} min="0" />
                    </div>
                    <textarea name="description" id="description" cols="30" rows="4"
                        placeholder="Description" onChange={handleChangeInput}
                        className="d-block my-4 w-100 p-2" value={description} />

                    {editorLoaded ? <CKEditor editor={ClassicEditor} data={editorContent} onChange={handleChangeEditorInput} /> : <p>Loading...</p>}
                    {/* <textarea name="content" id="content" cols="30" rows="6"
                        placeholder="Content" onChange={handleChangeInput}
                        className="d-block my-4 w-100 p-2" value={content} /> */}



                    <button type="submit" className="btn btn-info my-2 px-4">
                        {onEdit ? 'Update' : 'Create'}
                    </button>

                </div>

                <div className="col-md-6 my-4">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file border rounded">
                            <input type="file" className="custom-file-input"
                                onChange={handleUploadInput} multiple accept="image/*" />
                        </div>

                    </div>

                    <div className="row img-up mx-0">
                        {
                            images.map((img, index) => (
                                <div key={index} className="file_img my-1">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)}
                                        alt="" className="img-thumbnail rounded" />

                                    <span onClick={() => deleteImage(index)}>X</span>
                                </div>
                            ))
                        }
                    </div>


                </div>


            </form>


        </div>
    )
}

export default ProductsManager