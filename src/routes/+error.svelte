<script lang="ts">
    import { page } from "$app/stores";

    const defaultMessage = `Für alle anderen HTTP-Fehlercodes im Kontext des Fahrradwettrennens: "Entschuldigung, es scheint
		einen kleinen Sturz auf unserer Strecke gegeben zu haben. Wir arbeiten hart daran, den Unfall
		aufzuräumen und dich so schnell wie möglich wieder auf deinem Fahrrad zu sehen. Bitte versuche
		es später erneut oder wechsle auf eine andere Strecke, während wir uns um die Reparatur kümmern.`;
    let message = defaultMessage;

    $: switch ($page.status) {
        case 400: {
            message = `Hmm, das sieht so aus, als hättest du einen falschen Gang eingelegt. Bitte überprüfe deine
		    Anfrage und versuche es erneut, damit du schneller ans Ziel kommst.`;
            break;
        }
        case 404: {
            message = `Ups, da hast du dich wohl verfahren! Die von dir gesuchte Seite konnten wir leider nicht finden.
		        Vielleicht solltest du deine Pedale etwas fester treten und auf der richtigen Strecke bleiben?`;
            break;
        }
        case 429: {
            message = `Uh-oh! Du fährst zu schnell, mein Freund. Bitte bremse etwas ab, bevor du weiterfährst. Unser
		        Server braucht eine kleine Pause.`;
            break;
        }
        case 500: {
            message = `Oh nein! Wir haben einen Platten! Bitte gib uns einen Moment, um das Problem zu beheben. In der
		        Zwischenzeit kannst du eine Pause einlegen und dich auf das nächste Rennen vorbereiten.`;
            break;
        }
        case 503: {
            message = `Verzeihung, unsere Fahrräder sind im Moment im Service. Bitte nutze die Zeit, um deine Beine
		        auszuruhen und dich auf den nächsten Sprint vorzubereiten. Wir kümmern uns so schnell es geht
		        darum, das Problem in Ordnung zu bringen und dich wieder auf den Weg zu schicken.`;
            break;
        }
        default: {
            message = defaultMessage;
            break;
        }
    }
</script>

<h1>{$page.status}</h1>
<p>
    {message}
</p>

<style lang="scss">
    @import "../lib/styles/vars";
    p {
        margin: $default-space * 2;
        max-width: 50rem;
        line-height: 1.5;
    }
</style>
