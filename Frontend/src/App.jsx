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
import AdminPendingPanel from './pages/AdminPendingPanel.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import ReturnRefund from './pages/ReturnRefund.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

import Navbar from './components/Navbar.jsx';
import TopBar from './components/TopBar.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DialogProvider } from './context/DialogContext';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <DialogProvider>
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
            <Route path='/admin/seller-orders' element={<AdminPendingPanel />} />
            <Route path='/terms-conditions' element={<TermsAndConditions />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/return-refund' element={<ReturnRefund />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/my-orders/:id' element={<OrderDetails />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/error' element={<ErrorPage />} />
            {/* Catch-all: 404 for any unknown URL */}
            <Route path='*' element={<ErrorPage code={404} />} />
          </Routes>
        </DialogProvider>
      </CartProvider>
    </AuthProvider>
  )
}
export default App