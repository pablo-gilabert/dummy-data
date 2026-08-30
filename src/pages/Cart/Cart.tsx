import {
  useCart,
} from "../../CartContext/useCart"

import CartItem from "../../components/CartItem/CartItem"
import CartSummary from "../../components/CartSummary/CartSummary"

import styles from "./Cart.module.css"

const Cart = () => {

  const {
    items,
  } = useCart()

  return (

    <main className={styles.cart}>

      <h1 className={styles.title}>
        Cart
      </h1>

      {items.length === 0 ? (

        <p className={styles.empty}>
          Your cart is empty.
        </p>

      ) : (

        <>

          <section className={styles.list}>

            {items.map((item) => (

              <CartItem
                key={item.product.id}
                item={item}
              />

            ))}

          </section>

          <CartSummary />

        </>

      )}

    </main>
  )
}

export default Cart