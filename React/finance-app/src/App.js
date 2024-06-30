import React,{useState,useEffect} from 'react';
import api from "./api"

const App = () => { 
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category:"",
    description:"",
    is_income:false,
    date:""
  });
 

  const fetchTransactions = async () => {
    const response = await api.get("/transactions/");  //calling the get method from the fastapi with endpoint /transactions/
    setTransactions(response.data);
  }

  // useEffect will run the fetchTransactions function when the application loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (event)=>{
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value
    });
  }

  const handleFormSubmit = async(event)=>{
    event.preventDefault();
    await api.post("/transactions/",formData);
    fetchTransactions();
    setFormData({
      amount: "",
      category:"",
      description:"",
      is_income:false,
      date:""
    });
  }

  return(
    <div>
  <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">Finance App</a>
  </div>
  </nav>

  <div className='container'>
  <form onSubmit={handleFormSubmit}>
  <div className="mb-3 mt-4">
    <label htmlFor="amount" className="form-label">Amount</label>
    <input type="text" className="form-control" id="amount" onChange={handleInputChange} name="amount" value={formData.amount}/>
  </div>

  <div className="mb-3">
    <label htmlFor="category" className="form-label">Category</label>
    <input type="text" className="form-control" id="category"  onChange={handleInputChange} name="category" value={formData.category}/>
  </div>

  <div className="mb-3 ">
    <label htmlFor="description" className="form-label">Description</label>
    <input type="text" className="form-control" id="description" onChange={handleInputChange} name="description" value={formData.description}/>
  </div>
  
  <div className="mb-3">
    <input type="checkbox" id="is_income" name='is_income' onChange={handleInputChange} value={formData.is_income}/>
    <label className="form-label" htmlFor="is_income">Income ?</label>
  </div>

  <div className="mb-3">
    <label htmlFor="date" className="form-label">Date</label>
    <input type="text" className="form-control" id="date" onChange={handleInputChange} name="date" value={formData.date}/>
  </div>

  <button type="submit" className="btn btn-primary mb-4">Submit</button>
</form>

 <table className='table table-striped table-bordered table-hover'>
  <thead>
    <tr>
      <th>Amount</th>
      <th>Category</th>
      <th>Description</th>
      <th>Is Income</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {transactions.map((transaction) => (
      <tr key={transaction.id}>
        <td>{transaction.amount}</td>
        <td>{transaction.category}</td>
        <td>{transaction.description}</td>
        <td>{transaction.is_income? 'Yes':'No'}</td>
        <td>{transaction.date}</td>
      </tr>
    ))}
  </tbody>
 </table>

  </div>
    </div>
  )

}

export default App;
