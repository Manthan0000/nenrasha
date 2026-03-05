import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import MyAccount from './pages/MyAccount.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import AddProduct from './pages/AddProduct.jsx';
import MyListings from './pages/MyListings.jsx';
import Products from './pages/Products.jsx';
import LikedProducts from './pages/LikedProducts.jsx';

import Navbar from './components/Navbar.jsx';
import TopBar from './components/TopBar.jsx';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <TopBar />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/blog' element={<Blog />}/>
        <Route path='/my-account' element={<MyAccount />}/>
        <Route path='/category/:categoryName' element={<CategoryPage />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/liked-products' element={<LikedProducts />} />
        <Route path='/admin/add-product' element={<AddProduct />} />
        <Route path='/admin/edit-product/:id' element={<AddProduct />} />
        <Route path='/admin/my-listings' element={<MyListings />} />
      </Routes>
    </AuthProvider>
  )
}
export default App