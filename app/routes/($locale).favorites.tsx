import {Await} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from '@shopify/remix-oxygen';
import {CartForm, type CartQueryDataReturn} from '@shopify/hydrogen';

import {isLocalPath} from '~/lib/utils';
import {Cart} from '~/components';
import {useRootLoaderData} from '~/root';
import {Favorite} from '~/components/favorites/Favorite';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const favoriteId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors, userErrors} = result;

  headers.append('Set-Cookie', await context.session.commit());

  return json(
    {
      cart: cartResult,
      userErrors,
      errors,
      analytics: {
        favoriteId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return json(await cart.get());
}

export default function FavoriteRoute() {
  const rootData = useRootLoaderData();
  // @todo: finish on a separate PR
  return (
    <div className="grid w-full gap-8 p-6 py-8 md:p-8 lg:p-12 justify-items-start">
      <Await resolve={rootData?.cart}>
        {(favorite) => <Favorite layout="page" favorite={favorite} />}
      </Await>
    </div>
  );
}
