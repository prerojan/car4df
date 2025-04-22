import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      setMensagem(error.message || 'Erro desconhecido');
    } else {
      setMensagem('Pagamento criado com sucesso! ID: ' + paymentMethod.id);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Pagamento com Cartão</h2>
      <CardElement className="p-3 border rounded-md" />
      <button type="submit" disabled={!stripe || loading} className="w-full bg-blue-600 text-white p-2 rounded-xl">
        {loading ? 'Processando...' : 'Pagar'}
      </button>
      {mensagem && <p className="text-sm text-gray-600 mt-2">{mensagem}</p>}
    </form>
  );
}

export default function Pagamento() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}