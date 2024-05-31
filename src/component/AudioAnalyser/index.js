import React, {Component} from "react";
import PropTypes from "prop-types";
import MediaRecorder from "./MediaRecorder";
import RenderCanvas from "./RenderCanvas";


@MediaRecorder
@RenderCanvas
class AudioAnalyser extends Component {

    static renderProps = ["status", "audioSrc"]

    /**
     * @describe ["status", "audioSrc"]判断是否渲染
     * @param props: object
     * @param nextProps: object
     * @param renderProps: array
     * @return boolean
     */
    static checkRender(props, nextProps, renderProps) {
        const keys = [...new Set(renderProps)]
        return keys.some(v => props[v] !== nextProps[v])
    }

    shouldComponentUpdate(nextProps) {
        return AudioAnalyser.checkRender(this.props, nextProps, AudioAnalyser.renderProps)
    }

    componentDidUpdate(prevProps) {
        if (this.props.status !== prevProps.status) {
            const event = {
                inactive: this.stopAudio,
                recording: this.startAudio,
                paused: this.pauseAudio
            }[this.props.status];
            event && event();
        }
    }

    audioProgress = () => {
        const audio = new Audio();
        audio.src = this.props.audioSrc;
        const source = this.audioCtx.createMediaElementSource(audio);
        source.connect(this.analyser);
        this.renderCurve();

    }


    render() {
        const {
            children, className, audioSrc,show
        } = this.props;

        return (
          <div className={className}>
              <div>
                  {this.renderCanvas(show)}
              </div>
              {children}
              {/* {
                  audioSrc &&//展示音频
                  <div>
                      <audio controls src={audioSrc} id={audioSrc.substring(audioSrc.length - 6)}/>
                  </div>
              } */}
          </div>
        );
    }
}

AudioAnalyser.defaultProps = {
    status: "",
    audioSrc: "",
    backgroundColor: "rgba(0, 0, 0, 1)",
    strokeColor: "#ffffff",
    className: "audioContainer",
    audioBitsPerSecond: 128000,
    mimeType: "audio/webm",
    audioType: "audio/webm",
    audioOptions: {},
    width: 500,
    height: 100,
};
AudioAnalyser.propTypes = {
    status: PropTypes.string,
    audioSrc: PropTypes.string,
    backgroundColor: PropTypes.string,
    strokeColor: PropTypes.string,
    className: PropTypes.string,
    audioBitsPerSecond: PropTypes.number,
    audioType: PropTypes.string,
    audioOptions: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    timeslice: PropTypes.number,
    startCallback: PropTypes.func,
    pauseCallback: PropTypes.func,
    stopCallback: PropTypes.func,
    onRecordCallback: PropTypes.func,
    show: PropTypes.bool,
};
export default AudioAnalyser;

