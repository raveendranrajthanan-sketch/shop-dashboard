import "./App.css";

import { useEffect,useState } from "react";

function App() {
  const[products,setProducts] = useState([]);
  const[loading,setLoading] = useState(true);
  const[error,setError] = useState("");
  const [serarchTerm,setSearchTerm] = useState("");

  useEffect(()=>{
    async function loadProducts(){
      try{

        await new Promise(resolve=>setTimeout(resolve,2000));

        const res =await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        if(!res.ok){
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  },[]);

  const lowStock=products.filter(
    (p)=>p.stock<10
  ).length;
  const categories = new Set(
    products.map((p)=>p.category)
  ).size;
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(serarchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(serarchTerm.toLowerCase())
  );

  if(loading){
    return <h2>Loading products...</h2>;
  }

  if(error){
    return <h2>Error: {error}</h2>;
  }

  if(products.length === 0){
    return <h2>No products found.</h2>;
  }


  return (
  <div className="dashboard">
    <h1>Shop Dashboard</h1>
    <p className="dashboard-subtitle">
      Store Overview
    </p>

    <div className="summary-cards">
      <div className="summary-card">
        <h3>Total Products</h3>
        <h2>{products.length}</h2>
      </div>

      <div className="summary-card">
        <h3>Total Categories</h3>
        <h2>{categories}</h2>
      </div>

      <div className="summary-card">
        <h3>Low Stock Products</h3>
        <h2>{lowStock}</h2>
      </div>
    </div>

      <div className="product-section">
        <h2>Product List</h2>

        <input
          type="text"
          placeholder="Search products..."
          value={serarchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className="search-input"
        />

        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <p className="no-products">No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

  </div>
  
  );
}

export default App;