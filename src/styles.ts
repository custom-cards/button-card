import { css } from 'lit-element';

export const styles = css`
  ha-card {
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
  }
  ha-card.disabled {
    pointer-events: none;
    cursor: default;
  }
  ha-icon {
    display: inline-block;
    margin: auto;
  }
  ha-card.button-card-main {
    padding: 4% 0px;
    text-transform: none;
    font-weight: 400;
    font-size: 1.2rem;
    align-items: center;
    text-align: center;
    letter-spacing: normal;
    width: 100%;
  }
  div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  @keyframes blink{
    0%{opacity:0;}
    50%{opacity:1;}
    100%{opacity:0;}
  }
  @-webkit-keyframes rotating /* Safari and Chrome */ {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  .rotating {
    -webkit-animation: rotating 2s linear infinite;
    -moz-animation: rotating 2s linear infinite;
    -ms-animation: rotating 2s linear infinite;
    -o-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
  }

  .container {
    display: grid;
    max-height: 100%;
    text-align: center;
    height: 100%;
    align-items: middle;
  }
  .img-cell {
    grid-area: i;
    min-height: 0;
    min-width: 0;
  }

  .icon {
    height: 100%;
    max-width: 100%;
    object-fit: scale;
    overflow: hidden;
  }
  .name {
    grid-area: n;
    max-width: 100%;
    align-self: center;
    justify-self: center;
    /* margin: auto; */
  }
  .state {
    grid-area: s;
    max-width: 100%;
    align-self: center;
    justify-self: center;
    /* margin: auto; */
  }

  .container.vertical {
    grid-template-areas: "i" "n" "s";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content min-content;
  }

  .container.icon_name_state {
    grid-template-areas: "i n";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr;
  }

  .container.icon_name {
    grid-template-areas: "i n" "s s";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content;
  }

  .container.icon_state {
    grid-template-areas: "i s" "n n";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content;
  }

  .container.name_state {
    grid-template-areas: "i" "n";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content;
  }

  .container.icon_name_state2nd {
    grid-template-areas: "i n" "i s";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .container.icon_name_state2nd .name {
    align-self: end;
  }
  .container.icon_name_state2nd .state {
    align-self: start;
  }

  .container.icon_state_name2nd {
    grid-template-areas: "i s" "i n";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .container.icon_state_name2nd .state {
    align-self: end;
  }
  .container.icon_state_name2nd .name {
    align-self: start;
  }
`;

export default styles;
