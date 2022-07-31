/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import GlobalState from '../store/state';

// export const ViewModel = (function () {
//   const registry = {};

//   return {
//     // useViewModel<T>(TCreator: { new(): T; }): T {
//     //   const viewModel = (registry[TCreator.name] = registry[TCreator.name] || activate(TCreator));
//     //   const [stateViewModel, setStateViewModel] = useState(viewModel);

//     //   // @ts-ignore
//     //   if (!viewModel.__proxied) {
//     //     wrapModel(viewModel, () => setStateViewModel({ ...viewModel }));
//     //     // @ts-ignore
//     //     viewModel.__proxied = true;
//     //   }

//     //   return viewModel;
//     // }

//     useViewModel<T>(TCreator: { new(): T; }): T {
//       const viewModel = (registry[TCreator.name] = registry[TCreator.name] || activate(TCreator));
//       const [stateViewModel, setStateViewModel] = useState(0);

//       // @ts-ignore
//       if (!viewModel.__proxied) {
//         wrapModel(viewModel, () => setStateViewModel(prev => prev + 1));
//         // @ts-ignore
//         viewModel.__proxied = true;
//       }

//       return viewModel;
//     }

//   }
// })();


function activate<T>(TCreator: { new(): T; }): T {
  return new TCreator();
}

export default function useStore(initialState: GlobalState): GlobalState {
  const [state, setState] = useState(initialState);

  // @ts-ignore
  if (!state.__proxied) {
    wrapRootState(state, () => setState({ ...state }));
    // @ts-ignore
    state.__proxied = true;
  }

  return state;
}

function proxyMethodCalls(obj: Record<string, unknown>, postAction: () => void) {
  for (const propKey of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
    const originalMethod = obj[propKey];
    if (typeof originalMethod == 'function' && !(propKey as string).startsWith('_') && propKey != 'constructor') {
      // TODO: enhance via decorators + metadata
      obj[propKey] = function (...args: IArguments[]) {
        // @ts-ignore
        const result = originalMethod.apply(obj, args);
        // Doesn't matter if it's Promise or not we should call update after all
        return Promise.resolve(result).then((value) => {
          postAction();
          return value;
        });
      };
    }
  }

  return obj;
}

// @ts-ignore
function wrapRootState(rootState: Array, postAction: () => void) {
  for (const [field, model] of Object.entries(rootState)) {
    // @ts-ignore
    model.__storeContext = { postAction };
    // @ts-ignore
    rootState[field] = proxyMethodCalls(model, postAction);
  }
}

// @ts-ignore
function wrapModel(model: Object, postAction: () => void) {
  // @ts-ignore
  model.__storeContext = { postAction };
  // @ts-ignore
  model = proxyMethodCalls(model, postAction);
}
