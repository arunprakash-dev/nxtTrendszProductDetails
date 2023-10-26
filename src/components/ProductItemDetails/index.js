import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    similarProductDetails: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getUpdateData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    brand: data.brand,
    availability: data.availability,
    description: data.description,
    price: data.price,
    rating: data.rating,
  })

  getProductDetails = async () => {
    // const {productDetails, similarProductDetails} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const updatedData = this.getUpdateData(data)
      // console.log(updatedData)
      const updatedSimilarData = data.similar_products.map(each =>
        this.getUpdateData(each),
      )
      // console.log(updatedSimilarData)

      this.setState({
        productDetails: updatedData,
        similarProductDetails: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSimilarProducts = () => {
    const {similarProductDetails} = this.state
    return (
      <>
        <h1 className="lar-heading">Similar Products</h1>
        <ul className="ul">
          {similarProductDetails.map(each => (
            <SimilarProductItem key={each.id} similarProducts={each} />
          ))}
        </ul>
      </>
    )
  }

  renderProductDetails = () => {
    const {productDetails, quantity} = this.state

    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails
    return (
      <div className="pd-container">
        <Header />
        <div className="prod-lar-container">
          <div className="product-details-container">
            <img src={imageUrl} alt="product" className="product-image" />
            <div className="details-container">
              <h1 className="title"> {title} </h1>
              <p className="price"> Rs {price}/-</p>
              <div className="rating-reviews-container">
                <div className="status-container">
                  <p className="stars">{rating} </p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>

                <p className="reviews">{totalReviews} Reviews </p>
              </div>
              <p className="desc"> {description} </p>
              <p className="availability">
                {' '}
                <span className="special"> Available:</span> {availability}{' '}
              </p>
              <p className="availability">
                {' '}
                <span className="special"> Brand:</span> {brand}{' '}
              </p>
              <hr className="hr" />
              <div className="quantity-container">
                <button
                  type="button"
                  className="button"
                  onClick={this.updateQuantityDecrease}
                  data-testid="plus"
                >
                  <BsDashSquare />
                </button>

                <p className="quantity"> {quantity} </p>

                <button
                  type="button"
                  className="button"
                  onClick={this.updateQuantityIncrease}
                  data-testid="minus"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="button1">
                ADD TO CART
              </button>
            </div>
          </div>
          {this.renderSimilarProducts()}
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1 className="page-not-found-heading"> Product Not Found </h1>
        <Link to="/products">
          <button type="button" className="button1">
            {' '}
            Continue Shopping{' '}
          </button>
        </Link>
      </div>
    </>
  )

  updateQuantityIncrease = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  updateQuantityDecrease = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderProductDetails()

      default:
        return null
    }
  }
}

export default ProductItemDetails
