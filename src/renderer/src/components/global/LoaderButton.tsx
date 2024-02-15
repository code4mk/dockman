import { SpeakerWaveIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function LoaderButton(props: any): JSX.Element {
  const { type, processing, children } = props
  const Icon = props.icon || SpeakerWaveIcon
  return (
    <button
      type={type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled || processing || false}
      className={classNames(
        props.className,
        props.block ? 'flex justify-center w-full' : 'inline-flex',
        'items-center shadow-sm',
        'focus:outline-none transition-all px-4 py-2',
        'text-sm font-bold tracking-wide rounded-md',
        'border-2 border-primary',
        props.disabled
          ? 'bg-cms-gray-dark border-cms-gray-dark text-gray-500 cursor-not-allowed'
          : props.ghost
            ? 'text-primary bg-white hover:bg-primary hover:text-white'
            : props.alternate
              ? 'text-white bg-primary  hover:bg-secondary hover:text-white hover:border-secondary'
              : props.error
                ? 'text-cms-red bg-white border-cms-red'
                : 'text-white bg-secondary border-secondary hover:text-white hover:bg-primary hover:border-primary'
      )}
    >
      {!props.noIcon &&
        (processing ? (
          <span className="h-4 w-4 mr-2 scale-125 overflow-hidden">
            <svg
              className="animate-spin h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : (
          <Icon className="h-4 w-4 mr-2 transform scale-125" />
        ))}
      {children}
    </button>
  )
}
