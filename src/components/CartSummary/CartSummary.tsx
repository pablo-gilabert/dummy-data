import Swal from "sweetalert2"

import {
  useNavigate,
} from "react-router-dom"

import {
  useCart,
} from "../../store/useCart"

import styles from "./CartSummary.module.css"

const CartSummary = () => {

  const {
    items,
    clearCart,
  } = useCart()

  const navigate = useNavigate()

  const subtotal = items.reduce<number>(
    (sum, item) =>
      sum +
      item.product.price *
      item.quantity,
    0
  )

  const handleCheckout = () => {

    if (items.length === 0) {
      return
    }

    navigate("/checkout")
  }

  const handleClearCart = async () => {

    const result = await Swal.fire({

      title: "Clear cart?",

      text:
        "All products will be removed from your cart.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Clear cart",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#d62828",

      cancelButtonColor: "#6c757d",

      reverseButtons: true,

    })

    if (result.isConfirmed) {

      clearCart()

      await Swal.fire({

        title: "Cart cleared",

        text:
          "All products have been removed from your cart.",

        icon: "success",

        confirmButtonText: "OK",

        confirmButtonColor: "#2a9d8f",

      })

    }
  }

  return (

    <section className={styles.summary}>

      <h2 className={styles.title}>
        Order summary
      </h2>

      <div className={styles.row}>

        <span>
          Subtotal
        </span>

        <span>
          $ {subtotal.toFixed(2)}
        </span>

      </div>

      <div className={styles.row}>

        <span>
          Shipping
        </span>

        <span>
          Free
        </span>

      </div>

      <div className={styles.total}>

        <span>
          Total
        </span>

        <span>
          $ {subtotal.toFixed(2)}
        </span>

      </div>

      <button
        className={styles.checkoutButton}
        type="button"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        Checkout
      </button>

      <button
        className={styles.clearButton}
        type="button"
        onClick={handleClearCart}
        disabled={items.length === 0}
      >
        Clear cart
      </button>

    </section>
  )
}

export default CartSummary