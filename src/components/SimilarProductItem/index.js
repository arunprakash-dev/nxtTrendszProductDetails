// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props
  const {
    imageUrl,
    title,
    price,
    rating,

    brand,
  } = similarProducts
  console.log(title)
  return (
    <li className="list-item">
      <div className="similar-container1">
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="similar-product"
        />
        <p className="similar-title"> {title} </p>
        <p className="brand"> by {brand} </p>
        <div className="btm-container">
          <p className="price"> Rs {price}/-</p>
          <div className="status-container">
            <p className="stars">{rating} </p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
