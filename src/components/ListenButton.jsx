/**
 * ListenButton — Accessible text-to-speech trigger button.
 *
 * Displays contextual icon and label based on playback state:
 *  - Default: speaker icon + "Listen"
 *  - Preparing: spinner + "Preparing..."
 *  - Playing: mute icon + "Stop"
 *  - Replayed: refresh icon + "Replay"
 *
 * @module ListenButton
 * @param {object} props
 * @param {Function} props.onClick - Click handler to trigger TTS.
 * @param {boolean} [props.isPlaying=false] - Whether audio is currently playing.
 * @param {boolean} [props.isPreparing=false] - Whether audio is being prepared.
 * @param {boolean} [props.hasPlayed=false] - Whether the audio has been played before.
 * @param {string} [props.label='Listen'] - Display label / language indicator.
 */
import { IconSpeakerOn, IconSpeakerOff, IconRefresh } from './icons';
import './ListenButton.css';

export default function ListenButton({
  onClick,
  isPlaying = false,
  isPreparing = false,
  hasPlayed = false,
  label = 'Listen',
}) {
  /** Determine which icon to display based on playback state. */
  const getIcon = () => {
    if (isPreparing) return <span className="preparing-spinner" aria-hidden="true">•••</span>;
    if (isPlaying) return <IconSpeakerOff />;
    if (hasPlayed) return <IconRefresh />;
    return <IconSpeakerOn />;
  };

  /** Determine the button label text based on playback state and language. */
  const getText = () => {
    const isHindi = label === 'सुनें';
    if (isPreparing) return isHindi ? 'तैयार हो रहा है...' : 'Preparing...';
    if (isPlaying) return isHindi ? 'रोकें' : 'Stop';
    if (hasPlayed) return isHindi ? 'फिर से सुनें' : 'Replay';
    return label || 'Listen';
  };

  return (
    <button
      className={`listen-btn ${isPlaying ? 'playing' : ''} ${isPreparing ? 'preparing' : ''}`}
      onClick={onClick}
      disabled={isPreparing}
      aria-label={isPlaying ? 'Stop listening' : 'Listen to this content'}
      title={isPlaying ? 'Stop' : (label || 'Listen')}
      type="button"
    >
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
}
